const https = require('https');
const axios = require('axios')

exports.upload = (url, callback) => {
    axios.get(url).then((resp) => {
        return callback(resp.data);
    }).catch((err) => {
        console.log("Error Message: " + err.message);
    });
};
exports.isExisting = (type)=>{
    let arr = [
        'hot', 'trending', 'latest', 'new'
    ]
    return arr.includes(type)
}