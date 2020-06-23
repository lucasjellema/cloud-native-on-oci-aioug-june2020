const os = require('os');
const ociRequestor = require('./ociRequestor');
const fs = require('fs');
const https = require('https');
const configs = require('./oci-configuration').configs;
const log = require('./logger').l

let privateKeyPath = configs.privateKeyPath
if (privateKeyPath.indexOf("~/") === 0) {
    privateKeyPath = privateKeyPath.replace("~", os.homedir())
}
const privateKey = fs.readFileSync(privateKeyPath, 'ascii');

function signRequest(request, body = "") {
    ociRequestor.sign(request, {
        privateKey: privateKey,
        keyFingerprint: configs.keyFingerprint,
        tenancyId: configs.tenancyId,
        userId: configs.authUserId,
        "passphrase": configs.pass_phrase,
    }, body);
}



function getFileObject(bucket, filename) {
    return new Promise((resolve, reject) => {

        var options = {
            host: configs.objectStorageAPIEndpoint,
            path: "/n/" + encodeURIComponent(configs.namespaceName) + "/b/" + encodeURIComponent(bucket) + "/o/" + encodeURIComponent(filename),
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        
        var request = https.request(options, (response) => {
            let responseBody = "";
          //  log(JSON.stringify(response.headers), "callback function defined in handleRequest file Reader")
            response.on('data', function (chunk) {
                responseBody += chunk;
            });

            response.on('end', function () {
               // log(`Response Body ${responseBody} `, "resolve Promise ")
                resolve(responseBody);
            });

        });        
        signRequest(request, null);
        request.end();
    })
};

function wait(timeout) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, timeout);
    });
}

async function fileReader(bucket, fileName) {
    return new Promise(async (resolve, reject) => {
        const data = await getFileObject(bucket, fileName)
       // log(`geFileObject resolved to ${data}`)
        resolve(data)
    })
}

module.exports = {
    fileReader: fileReader
}




