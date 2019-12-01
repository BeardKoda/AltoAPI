var express = require('express');
var router = express.Router();

// custom controllers
var SongController 	= require('../../app/controllers/SongController');

// login routes
router.get('/hot', SongController.hot);
router.get('/trending', SongController.trending);
router.get('/featured', SongController.featured);
router.get('/:id', SongController.getById);

// 404 response
router.get('*', function(req, res){
  res.status(404).json({error:'Resource not found'});
});

module.exports = router;