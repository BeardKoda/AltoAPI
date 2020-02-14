const s3 = require('../../config/s3')
const { S3_BUCKET } = require('../../config/app')
const fs = require('fs');

exports.upload = (file, filename, callback) => {
    const params = {
        Bucket: S3_BUCKET,
        Key: filename, // File name you want to save as in S3
        Body: file
    };
    console.log('here',params)
    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        console.log(err, data)
        if (err) {
            console.log(err)
            return callback(err)
        }
        return callback(null,data.Location)
    }).on('httpUploadProgress', function(progress) {
        // var loadedTotal = 0;
        loaded = progress.loaded
        total = progress.total
        var pro = parseInt((loaded / total) * 100)
        console.log(pro+'%', loaded, total)
    });
}

exports.stream = (file, callback)=>{
    console.log(file)
    const params = {
        Bucket: S3_BUCKET,
        Key: file
    };
    // var s3Stream = s3.getObject(params).createReadStream();
    s3.getObject(params,function(err, data) {
            // console.log(err, data.Body)
            if (err) {
                console.error('error', err); // an error occurred
            } else {
                const string = new TextDecoder('utf-8').decode(data.Body);
                // console.log(string);
                return callback(null,string)
            }
    });
    // return s3Stream;
}   