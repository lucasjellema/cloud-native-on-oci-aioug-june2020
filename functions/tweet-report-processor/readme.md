The twitter consumer is invoked on the command line with:
`node index.js hashtag minutes`

where hashtag is a Twitter Hashtag and minutes is the period in time that the function should go back to find tweets (note: the Twitter search API used does not support more than 7 days worth of history)

For example:
`node index.js trump 2`


The twitter consumer will produce a JSON file and store is on OCI Object Storage. The name of the bucket is hard coded: tweet-reports.

The file oci-configuration.js contains the details for the OCI Tenancy. The file oci_api_key.pem contains the private key for connecting to the OCI tenancy (for making authorized REST API calls)

The contents of the JSON file that is produced looks like this:
```
{
    "tweets": [
        {
            "creationTime": "2020-06-22T05:33:54.000Z",
            "tweetText": "RT @pwrfulwomantoo: So this was the lefts 16 year plan 2 destroy America from within. Thankfully #Trump won &amp; lunatic nutjobs on the left w…",
            "id": "1274938645619884032",
            "hashtags": "#Trump ",
            "lang": "en"
        },
        {
            ...
        }
    ]
}
```
To turn this Node application into an Fn Function:

Open Cloud Shell

git clone https://github.com/lucasjellema/cloud-native-on-oci-aioug-june2020
cd cloud-native-on-oci-aioug-june2020/functions/twitter-consumer

npm install

touch oci-configuration.js
touch oci_api_key.pem

copy contents to oci-configuration.js and oci_api_key.pem

test run of the application:
node index.js trump 2

check if file is created in bucket tweet-reports

fn list contexts

fn use context us-ashburn-1


fn update context oracle.compartment-id ocid1.compartment.oc1..aaaaaaaa5q2srleka3ll2xgpcdj3uns3nshzc3lbn2wgx2kcuah5blh47icq

nss=$(oci os ns get)
export ns=$(echo $nss | jq -r '.data')

fn update context registry iad.ocir.io/$ns/cloudlab-repo

docker login iad.ocir.io 

idtwlqf2hanz/jellema@amis.nl
5<+ADS)PCjJFW8xk1.7o

fn -v deploy --app lab1

echo -n '{"hashtag":"Trump", "minutes": 3}' | fn invoke "lab1" "tweet-consumer" --content-type application/json

API Gateway

Open API GW in Console: https://console.us-ashburn-1.oraclecloud.com/api-gateway/gateways/ocid1.apigateway.oc1.iad.amaaaaaa6sde7caam272oxj5yxfbjpm472b3vc2abt65lhvvsigucefj5bla

Edit API Deployment; add route for 
/consume-tweets
to function

endpoint: 
https://a7otzunjmey252aivwp2gfhrfq.apigateway.us-ashburn-1.oci.customer-oci.com/my-depl1/consume-tweets?hashtag=Trump&minutes=3

curl -X "POST" -H "Content-Type: application/json" -d '{ "hashtag":"trump", "minutes": 2}' https://a7otzunjmey252aivwp2gfhrfq.apigateway.us-ashburn-1.oci.customer-oci.com/my-depl1/consume-tweets


curl -X "GET" -H "Content-Type: application/json"  $funInvokeEndpoint?hashtag=Rutte&minutes=300

## Prerequisites

Bucket *tweet-reports* exists in the compartment and namespace specified in oci-configuration.js


## Notes
After making changes in CloudShell and in GitHub Repo, to consolidate changes to CloudShell

git fetch --all
git reset --hard origin/master
