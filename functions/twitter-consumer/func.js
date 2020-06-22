const fdk=require('@fnproject/fdk');
const tweetConsumer=require('./index')
fdk.handle(async function(input, ctx){
  console.log(`TweetConsumer invoked with body ${JSON.stringify(input)}`)
  console.log(`TweetConsumer invoked with Request URL ${JSON.stringify(ctx.headers["Fn-Http-Request-Url"])}`)
  
  const x = await tweetConsumer.produceTweetReport( input.hashtag?input.hashtag:"AIOUG", input.minutes?input.minutes:5)
  x.url= ctx.headers["Fn-Http-Request-Url"]
  return x
})



// invoke with :
// echo -n '{"hashtag":"aioug","minutes":5"}' | fn invoke lab-app tweet-consumer

// deploy with :
// fn deploy --app lab-app 