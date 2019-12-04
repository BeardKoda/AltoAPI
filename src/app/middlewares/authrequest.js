var jwt = require('jsonwebtoken');
const config = require('../../config/jwt')

let middleware = (req, res, next) => {
    //Do your session checking...    
    var tok = req.headers['access-token'] || req.body['access-token'];
    if(!tok)  return res.status(403).json({ auth: false, message: 'Access Denied, No token provided.'+token });
    var token = tok.split(" ")[1]
    if (!token) return res.status(403).json({ auth: false, message: 'Access Denied, No token provided.'+token });
    
    jwt.verify(token, config.jwt_secret, (err, decoded) => {
        if (err) return res.status(401).json({ auth: false, message: 'Failed to authenticate token.'+token});
        res.user = decoded
        next()
    });
}
module.exports = middleware;