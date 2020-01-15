var jwt = require('jsonwebtoken');
const config = require('../../../config/jwt')

let middleware = (req, res, next) => {
    //Do your session checking...    
    var tok = req.headers['access-token'] || req.body['access-token'] || req.headers.authorization || req.header.Authorization;
    if(!tok)  return res.status(403).json({ auth: false, message: 'Access Denied, No token provided.'+tok});
    else if(req.headers['access-token']){ var token = tok.split(' ')[1];}
    else if(req.headers.authorization){ var token = tok.split(' ')[1]}
    else if(req.headers.Authorization){ var token = tok.split(' ')[1]}
    else{ let token = tok;}
    if (!token) return res.status(403).json({ auth: false, message: 'Access Denied, No token provided.'+token});
    
    jwt.verify(token, config.jwt_secret, (err, decoded) => {
        if (err){ return res.status(401).json({ auth: false, message: 'Failed to authenticate token.'+tok});}
        res.user = decoded
        next()
    });
}
module.exports = middleware;