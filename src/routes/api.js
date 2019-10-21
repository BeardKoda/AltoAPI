var express = require('express');
var router = express.Router();
var authCheck = require("../app/middlewares/authrequest")
const { check } = require('express-validator')

// custom controllers
var AuthController 	= require('../app/controllers/auth/authController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// login routes
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
// router.get('/login', LoginController.index);
router.get('/me', authCheck, AuthController.me);

// 404 response
router.get('*', function(req, res){
  res.json({error:'Resource not found'}, 404);
});

module.exports = router;