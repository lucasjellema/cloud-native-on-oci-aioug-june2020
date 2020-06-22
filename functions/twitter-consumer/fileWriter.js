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
// generates a function to handle the https.request response object
function handleRequest(callback) {


    return function (response) {
        var responseBody = "";
        log(JSON.stringify(response.headers), "callback function defined in handleRequest")
        response.on('data', function (chunk) {
            responseBody += chunk;
        });

        response.on('end', function () {
            log(`Response Body ${responseBody} `, "callback function defined in handleRequest")
            callback(JSON.responseBody ? parse(responseBody) : { "no": "contents" });
        });
    }
}


function createFileObject(bucket, filename, contentsAsString) {
    return new Promise((resolve, reject) => {
        var options = {
            host: configs.objectStorageAPIEndpoint,
            path: "/n/" + encodeURIComponent(configs.namespaceName) + "/b/" + encodeURIComponent(bucket) + "/o/" + encodeURIComponent(filename),
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        var request = https.request(options, (response) => {
            let responseBody = "";
           // log(JSON.stringify(response.headers), " fileWriter")
            response.on('data', function (chunk) {
                responseBody += chunk;
            });

            response.on('end', function () {
                log(`Response Body ${responseBody} `, "resolve Promise Create File Object")
                resolve(responseBody);
            });

        });
        let body = contentsAsString + "                                                                                                                                 "

        signRequest(request, body);
        request.write(body)
        delete options.body;
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

    async function fileWriter(bucket, fileName, contents, nowDate = new Date()) {
        return new Promise(async (resolve, reject) => {
            const data = await createFileObject(bucket, fileName, contents)
            log(`createFileObject resolved to ${data}`)
            resolve(data)
        })
        // return new Promise((resolve, reject) => {
        //     createFileObject(bucket, fileName, contents, function (data) {
        //         log(`Data returned from OCI REST API Call ${JSON.stringify(data)}`, "fileWriter");
        //         resolve(data)
        //     });
        // })

    }

    module.exports = {
        fileWriter: fileWriter
    }




