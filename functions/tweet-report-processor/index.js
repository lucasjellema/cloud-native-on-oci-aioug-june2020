const fileReader = require('./fileReader')
const NoSQLClient = require('oracle-nosqldb').NoSQLClient;
const nosqlClient = new NoSQLClient('config.json');

const https = require('https');
const os = require('os');
const fs = require('fs');
const ociRequestor = require('./ociRequestor');
const bucketName = "tweet-reports"
const tableName = 'TWEETS_TABLE';
const configs = require('./oci-configuration').configs;

let privateKeyPath = configs.privateKeyPath
if (privateKeyPath.indexOf("~/") === 0) {
    privateKeyPath = privateKeyPath.replace("~", os.homedir())
}
const privateKey = fs.readFileSync(privateKeyPath, 'ascii');

function signRequest(request, body = "") {
    ociRequestor.sign(request, {
        privateKey: privateKey,
        keyFingerprint: configs.keyFingerprint,
        tenancyId: configs.tenancyId,
        userId: configs.authUserId
    }, body);
}

function encodeString(txt) {
    return new Buffer(txt?txt:"(empty)").toString('base64')
  //  return Buffer().from(txt ? txt : "(empty)").toString('base64')
}

// messages is any array of objects with a key and a body property
// for example {"key":"42", "body":"string with meaningful contents"}
const publishMessageToStream = async function (streamId, messages) {
    return new Promise((resolve, reject) => {
        const options = {
            host: configs.streamingAPIEndpoint,
            path: "/20180418/streams/" + encodeURIComponent(streamId) + "/messages",
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };
        let streamMessage = { "messages": [] };
        for (let i = 0; i < messages.length; i++) {
            streamMessage.messages.push({ "key": encodeString(messages[i].key), "value": encodeString(messages[i].body) })
        }
        let body = JSON.stringify(streamMessage)
        let request = https.request(options, (response) => {
            let responseBody = "";
            response.on('data', function (chunk) {
                responseBody += chunk;
            });
            response.on('end', function () {
                resolve(responseBody);
            });
        });
        signRequest(request, body);
        request.write(body)
        request.end();
    })//promise
};//publishMessageToStream

const publishTweetsOnStream = async function (streamId, tweetsReport) {
    // loop over all tweets
    const streamingReport = []
    for (let i = 0; i < tweetsReport.tweets.length; i++) {
        tweet = tweetsReport.tweets[i]
        messages = [ {"key":tweet.id, "body": JSON.stringify({tweet})}]
        const pubResult = await publishMessageToStream(streamId, messages)
        streamingReport.push(JSON.stringify(pubResult))
    }// loop   
    return streamingReport
}//publishTweetsOnStream

const persistTweetsInNOSQL = async function (tweetsReport) {
    // loop over all tweets
    for (let i = 0; i < tweetsReport.tweets.length; i++) {
        tweet = tweetsReport.tweets[i]
        try {
            // insert record into NoSQL Database table 
            let result = await nosqlClient.put(tableName, {
                "id": tweet.id, "text": tweet.tweetText,
                "author": tweet.author, "tweet_timestamp": tweet.creationTime
                , "language": tweet.lang, "hashtags": tweet.hashtags
            });
        } catch (e) {
            console.log(`Failed to create NoSQL Record ${JSON.stringify(e)}`)
        }

    }//for
    return {}
}

const streamId = "ocid1.stream.oc1.iad.amaaaaaa6sde7caa2z74vlzm7ssoqd3q6qixbrineq7xxl2luffnvbpffxfa" // lab-stream

// filename indicates an object on OCI Object Storage in the preconfigured bucket
const processTweetReport = async function (filename) {
    console.log(`Processing Tweetreport ${filename} in bucket ${bucketName}`)
    const file = await fileReader.fileReader(bucketName, filename)
    const tweetsReport = JSON.parse(file)
    await persistTweetsInNOSQL(tweetsReport)
    const streamPublishResult = await publishTweetsOnStream(streamId, tweetsReport);
    return { "NumberOfTweetsProcessed": tweetsReport.tweets.length, "filename": filename }
}


const run = async function () {
    if (process.argv && process.argv[2]) {
        const filename = process.argv[2]
        if (!filename) {
            log('No Filename is defined; provide filename in first command line parameter')
            throw "No Filename defined"
        }
        const result = await processTweetReport(filename)
        console.log(`Result from processTweetReport: ${JSON.stringify(result)}`)
        return {}
    }
}

run()

module.exports = {
    processTweetReport: processTweetReport
}




// node index.js "tweets-Ajax-2020-06-22T09:52:48.json"