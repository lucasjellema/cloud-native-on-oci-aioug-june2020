const fileReader = require('./fileReader')
const NoSQLClient = require('oracle-nosqldb').NoSQLClient;
const client = new NoSQLClient('config.json');
const bucketName = "tweet-reports"
const tableName = 'TWEETS_TABLE';

const persistTweetsInNOSQL = async function (tweetsReport) {
    // loop over all tweets
    for (let i = 0; i < tweetsReport.tweets.length; i++) {
        tweet = tweetsReport.tweets[i]
        try {
            // insert record into NoSQL Database table 
            let result = await client.put(tableName, {
                id: tweet.id, text: tweet.tweetText,
                author: tweet.author, tweet_timestamp: tweet.creationTime
                , language: tweet.lang, hashtags: tweet.hashtags
            });           
        } catch (e) {
            console.log(`Failed to create NoSQL Record ${JSON.stringify(e)}`)
        }
        
    }//for
    return {}
}


const processTweetReport = async function (filename) {
    const file = await fileReader.fileReader(bucketName, filename)
    const tweetsReport = JSON.parse(file)
    await persistTweetsInNOSQL(tweetsReport)
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