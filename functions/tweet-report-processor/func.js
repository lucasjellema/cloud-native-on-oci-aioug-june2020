const fdk = require('@fnproject/fdk');
const tweetReportProcessor = require('./index')
const url = require('url');
fdk.handle(async function (input, ctx) {
  console.log(`TweetReportProcessor invoked with body ${JSON.stringify(input)}`)
  console.log(`TweetReportProcessor invoked with context ${JSON.stringify(input)}`)
  const requestURL = ctx.headers["Fn-Http-Request-Url"][0]
  console.log(`TweetReportProcessor invoked with Request URL ${JSON.stringify(requestURL)}`)
  const filename = "tweets-Trump-2020-06-22T09:43:19.json"
  const x = await tweetReportProcessor.processTweetReport(filename)
  x.url = ctx.headers["Fn-Http-Request-Url"]
  x.queryData = queryData
  return x
})



// invoke with :
// echo -n '{"hashtag":"aioug","minutes":5"}' | fn invoke lab-app tweet-consumer

// deploy with :
// fn deploy --app lab-app 