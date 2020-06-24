const Twit = require('twit')
const fileWriter = require('./fileWriter')
const fileReader = require('./fileReader')

T = new Twit({
    consumer_key: 'ZdDrNIQhS9fGJKEvN9bIA',
    consumer_secret: 'srkVo4oFfnSYEIRAwrzRbuejZBywwrlrBzSVHAr4',
    access_token: '12522762-0pcbFS5z5WbEWRsCB4jXbiZwEOGEEEd6hZaQw8fHn',
    access_token_secret: 'opQN7BXOXLYCGBuOLayzQuGPh8vv9rKGHkahGaq1AxtwL',
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL: true,     // optional - requires SSL certificates to be valid.
    // https://developer.twitter.com/en/apps/6008469
})


const queryTweets = async (hashtag, howFarBack) => {
    return new Promise((resolve, reject) => {
        let today = new Date().toISOString()
        let fromDate = today.substr(0, 10) //yyyy-mm-dd
        const referenceTimestamp = new Date(new Date().getTime() - howFarBack * 60000)

        const referenceTimestampString = referenceTimestamp.toISOString()
        console.log(`Only tweets created after ${referenceTimestampString}`)
        T.get('search/tweets', { q: `#${hashtag} since:${fromDate}`, count: 50 }, function (err, data, response) {
            if (err) return reject(err)
            const tweets = []
            for (let i = 0; i < data.statuses.length; i++) {
                // filter on and rewrite timestamp Sun Jun 21 19:37:43 +0000 2020
                let tweetCreatedAt = new Date(Date.parse(data.statuses[i].created_at));
                if (tweetCreatedAt.getTime() > referenceTimestamp.getTime()) {
                    // remove twee if tweetCreatedAt < referenceTimestamp
                    data.statuses[i].creationTime = tweetCreatedAt.toISOString()                    
                    tweets.push({
                        "creationTime": tweetCreatedAt.toISOString()
                        , "author" : data.statuses[i].user.name
                        , "tweetText": data.statuses[i].text
                        , "id": data.statuses[i].id_str
                        , "hashtags": data.statuses[i].entities.hashtags.reduce((tags, tag)=> {return `${tags}#${tag.text} `},"")
                        , "lang": data.statuses[i].lang
                    })
                }
            }
            resolve(tweets)
        })
    })
}

const bucketName = "tweet-reports"

const produceTweetReport = async function (hashtag, minutes) {
    const tweets= await queryTweets(hashtag, minutes)
    //console.log(tweets)
    const filename = `tweets-${hashtag}-${new Date().toISOString().substr(0, 19)}.json`  //yyyy-mm-ddThh:mi:ss

    // the padEnd is added because it seems bytes are getting lost when creating the file object; spaces are added that can get lost without affecting the JSON content 
    let data = await fileWriter.fileWriter(bucketName, filename, JSON.stringify({"tweets": tweets})+" ".padEnd(550))
   // console.log(`response from file writer: ${JSON.stringify(data)}`)    
    return {"NumberOfTweetsProcessed" : tweets.length, "filename":filename}
}


function wait (timeout) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, timeout);
    });
  }

const defaultPeriod = 5
const run = async function () {
    if (process.argv && process.argv[2]) {
        const hashtag = process.argv[2]
        const minutes = process.argv[3] ? process.argv[3] : defaultPeriod

        if (!hashtag) {
            log('No Hashtag is defined; provide hashtag in first command line parameter')
            throw "No Hashtag defined"
        }
        if (!minutes) {
            log(`No minutes is defined; use last ${defaultPeriod} minutes as default`)
        }
        const result = await produceTweetReport(hashtag, minutes)
        console.log(`Result from produceTweetReport: ${JSON.stringify(result)}`)

    } else {
        
        const tweets = await queryTweets("aioug", 400)
        console.log(tweets)
    }
}

run()

module.exports = {
    produceTweetReport: produceTweetReport
}