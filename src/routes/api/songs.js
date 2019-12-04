var express = require('express');
var router = express.Router();

// custom controllers
var SongController 	= require('../../app/controllers/SongController');

// login routes
router.get('/', SongController.getByLevel);
router.get('/:id', SongController.getById);
router.post('/fav/add/:id', SongController.addToFav)
router.post('/fav/remove/:id', SongController.removeFromFav)

// 404 response
router.get('*', function(req, res){
  res.status(404).json({error:'Resource not found'});
});

module.exports = router;