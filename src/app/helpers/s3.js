const s3 = require('../../config/s3')
const { S3_BUCKET } = require('../../config/app')
const fs = require('fs');

exports.upload = (filePath, filename, callback) => {
    const file=fs.readFileSync(filePath)
    // Setting up S3 upload parameters
    const params = {
        Bucket: S3_BUCKET,
        Key: filename, // File name you want to save as in S3
        Body: file
    };
    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            return callback(err)
        }
        return callback(null,data.Location)
    });
}