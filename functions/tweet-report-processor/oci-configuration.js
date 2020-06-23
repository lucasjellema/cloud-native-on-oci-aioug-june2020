const configs=
    {
        "namespaceName": "idtwlqf2hanz",
        "region": "us-ashburn-1",
        "compartmentId": "ocid1.compartment.oc1..aaaaaaaa5q2srleka3l",
        "authUserId": "ocid1.user.oc1..aaaaaaaaby4oyyt2l4dmxl6zr7eselv5q",
        "identityDomain": "identity.us-ashburn-1.oraclecloud.com",
        "tenancyId": "ocid1.tenancy.oc1..aaaaaaaag7c7slwmegmlf3gg6okq",
        "keyFingerprint": "02:91:6c:49:d8:04:",
        "privateKeyPath": "./oci_api_key.pem",
        "coreServicesDomain": "iaas.us-ashburn-1.oraclecloud.com",
        "bucketOCID": "ocid1.bucket.oc1.iad.aaaaaaaxa",
        "bucketName":"tweet-reports",
        "objectStorageAPIEndpoint":"objectstorage.us-ashburn-1.oraclecloud.com",
        "streamingAPIEndpoint": "streaming.us-ashburn-1.oci.oraclecloud.com"
    }

 module.exports = {
    configs : configs
};

// note:

// the content of the file after pasting in the JSON data should look like this:

// const configs=
//     {
//         namespaceName: `${process.env["ns"]}`,
//         region: `${process.env["REGION"]}`,
//         compartmentId: `${process.env["compartmentId"]}`, //lab-compartment
//         authUserId: `${process.env["USER_OCID"]}`,
//         identityDomain: `identity.${process.env["REGION"]}.oraclecloud.com`,
//         tenancyId: `${process.env["TENANCY_OCID"]}`,
//         keyFingerprint: "YOUR_FINGERPRINT_FROM FILE ./oci_api_key.pem",
//         privateKeyPath: "./oci_api_key.pem",
//         coreServicesDomain: `iaas.${process.env["REGION"]}.oraclecloud.com`,
//         bucketOCID: process.env['bucketOCID'],
//         bucketName:process.env['bucketName'],
//         objectStorageAPIEndpoint:`objectstorage.${process.env["REGION"]}.oraclecloud.com`,
//         streamingAPIEndpoint: `streaming.${process.env["REGION"]}.oci.oraclecloud.com` 
//     }
