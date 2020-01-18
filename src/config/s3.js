const AWS = require('aws-sdk');
const { S3_ID, S3_SECRET } = require('../config/app')

const s3 = new AWS.S3({
    accessKeyId: S3_ID,
    secretAccessKey: S3_SECRET
});

module.exports = s3