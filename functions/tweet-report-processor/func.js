const fdk = require('@fnproject/fdk');
const tweetReportProcessor = require('./index')
const url = require('url');
fdk.handle(async function (input, ctx) {
  let filename = "tweets-Trump-2020-06-22T09:43:19.json"
  console.log(`TweetReportProcessor invoked with body ${JSON.stringify(input)}`)
  console.log(`TweetReportProcessor invoked with context ${JSON.stringify(input)}`)
  if (input.eventType ) { // cloud event 
    console.log(`Cloud Event ${input.eventType}`)
    console.log(`Filename ${input.data.resourceName}`)
    filename = input.data.resourceName
  } else {
    if (input.filename) {
      filename = input.filename
    }
    else {
      if (ctx.headers["Fn-Http-Request-Url"]) {
        const requestURL = ctx.headers["Fn-Http-Request-Url"][0]
        console.log(`TweetReportProcessor invoked with Request URL ${JSON.stringify(requestURL)}`)
        const queryData = url.parse(requestURL, true).query;
        filename = queryData.filname
      }
    }
  }
  console.log(`Go process file ${filename}`)
  const x = await tweetReportProcessor.processTweetReport(filename)

  return x
})



// invoke with :
// echo -n '{"filename":"tweets-aioug-2020-06-22T08:57:16.json"}' | fn invoke lab-app tweet-report-processot

// deploy with :
// fn deploy --app lab-app 