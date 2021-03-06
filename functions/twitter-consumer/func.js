const fdk = require('@fnproject/fdk');
const tweetConsumer = require('./index')
const url = require('url');
fdk.handle(async function (input, ctx) {
  
  console.log(`TweetConsumer invoked with body ${input?JSON.stringify(input):"geen input"}`)

  let requestURL = ctx.headers["Fn-Http-Request-Url"]
  let queryData
  if (requestURL) {
    console.log(`TweetConsumer invoked with Request URL ${JSON.stringify(requestURL[0])}`)
    /*[\"/my-depl1/consume-tweets?hashtag=tulsa\u0026minutes=300\"] */
    queryData = url.parse(requestURL[0], true).query;
    console.log(`querydata = ${JSON.stringify(queryData)}`)
  }
  const hashtag = queryData ?
    queryData.hashtag ? queryData.hashtag : input.hashtag ? input.hashtag : "AIOUG"
    : input.hashtag ? input.hashtag : "AIOUG"

  const minutes = queryData ?
    queryData.minutes ? queryData.minutes : input.minutes ? input.minutes : 5
    : input.minutes ? input.minutes : 5
  const x = await tweetConsumer.produceTweetReport(hashtag, minutes)
  x.url = ctx.headers["Fn-Http-Request-Url"]
  x.queryData = queryData
  return x
})



// invoke with :
// echo -n '{"hashtag":"aioug","minutes":5"}' | fn invoke lab-app tweet-consumer

// deploy with :
// fn deploy --app lab-app 