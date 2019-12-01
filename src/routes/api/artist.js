var express = require('express');
var router = express.Router();

// custom controllers
var ArtistController 	= require('../../app/controllers/ArtistController');

// login routes
router.get('/all', ArtistController.all);
router.get('/:id', ArtistController.getById);

// 404 response
router.get('*', function(req, res){
  res.status(404).json({error:'Resource not found'});
});

module.exports = router;