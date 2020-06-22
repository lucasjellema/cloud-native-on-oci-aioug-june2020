const fdk=require('@fnproject/fdk');
const tweetConsumer=require('./index')
const url = require('url');
fdk.handle(async function(input, ctx){
  console.log(`TweetConsumer invoked with body ${JSON.stringify(input)}`)
  console.log(`TweetConsumer invoked with Request URL ${JSON.stringify(ctx.headers["Fn-Http-Request-Url"])}`)
  const queryData = url.parse(ctx.headers["Fn-Http-Request-Url"], true).query;
  console.log(`queryDate = ${JSON.stringify(queryData)}`)
  
  const x = await tweetConsumer.produceTweetReport( input.hashtag?input.hashtag:"AIOUG", input.minutes?input.minutes:5)
  x.url= ctx.headers["Fn-Http-Request-Url"]
  x.queryData = queryData
  return x
})



// invoke with :
// echo -n '{"hashtag":"aioug","minutes":5"}' | fn invoke lab-app tweet-consumer

// deploy with :
// fn deploy --app lab-app 