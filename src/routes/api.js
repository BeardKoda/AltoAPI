var express = require('express');
var router = express.Router();
var authCheck = require("../app/middlewares/authrequest")
const { check } = require('express-validator')
const song = require('./api/songs'); 
const auth = require('./api/auth'); 
const album = require('./api/album')
const artist = require('./api/artist')


router.use('/', auth);
router.use('/song', authCheck,song);
router.use('/album', authCheck, album);
router.use('/artist', authCheck, artist);


// 404 response
router.get('*', function(req, res){
  res.status(404).json({error:'Route not found'});
});

module.exports = router;