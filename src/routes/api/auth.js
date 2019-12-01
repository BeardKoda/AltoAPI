var express = require('express');
var router = express.Router();
// custom controllers
var AuthController 	= require('../../app/controllers/auth/authController');

// login routes
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
// router.get('/login', LoginController.index);
router.get('/me', AuthController.me);

// 404 response
router.get('*', function(req, res){
  res.status(404).json({error:'Resource not found'});
});
  
module.exports = router;