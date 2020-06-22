const fdk=require('@fnproject/fdk');
const tweetConsumer=require('./index')
fdk.handle(function(input, ctx){
  console.log(`TweetConsumer invoked with ${JSON.stringify(input)}`)
  console.log(`TweetConsumer invoked with ctr ${JSON.stringify(ctx)}`)
  
  const x = tweetConsumer.produceTweetReport( input.hashtag, input.minutes?input.minutes:5)
  return x
})



// invoke with :
// echo -n '{"bucketname":"fn-bucket","filename":"my-special-file.txt","contents":"De inhoud van de nieuwe file"}' | fn invoke lab-app file-writer

// deploy with :
// fn deploy --app lab-app 