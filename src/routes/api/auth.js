var express = require('express');
var router = express.Router();
// custom controllers
var AuthController 	= require('../../app/controllers/AuthController');
var Request = require('../../app/requests/AuthRequest')
var authCheck = require("../../app/middlewares/authrequest")

// login routes
router.post('/login', Request.validate('login'), AuthController.login);
router.post('/register', Request.validate('register'), AuthController.register);
router.get('/profile', authCheck, AuthController.getData);

// 404 response
router.get('*', function(req, res){
  res.status(404).json({error:'Resource not found'});
});
  
module.exports = router;