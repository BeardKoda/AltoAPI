var express = require('express');
var router = express.Router();
var authCheck = require("../app/middlewares/authrequest")
const { check } = require('express-validator')
const song = require('./api/songs'); 
const auth = require('./api/auth'); 
const album = require('./api/album')
const artist = require('./api/artist')


router.use('/auth', auth);
router.use('/song', song);
router.use('/album', album);
router.use('/artist', artist);


// 404 response
router.get('*', function(req, res){
  res.status(404).json({error:'Route not found'});
});

module.exports = router;