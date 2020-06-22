const fdk=require('@fnproject/fdk');
const tweetConsumer=require('./index')
fdk.handle(async function(input, ctx){
  console.log(`TweetConsumer invoked with ${JSON.stringify(input)}`)
  console.log(`TweetConsumer invoked with ctr ${JSON.stringify(ctx["Fn-Http-Request-Url"])}`)
  
  const x = await tweetConsumer.produceTweetReport( input.hashtag?input.hashtag:"AIOUG", input.minutes?input.minutes:5)
  x.url= ctx["Fn-Http-Request-Url"]
  return x
})



// invoke with :
// echo -n '{"bucketname":"fn-bucket","filename":"my-special-file.txt","contents":"De inhoud van de nieuwe file"}' | fn invoke lab-app file-writer

// deploy with :
// fn deploy --app lab-app 