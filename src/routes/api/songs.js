var express = require('express');
var router = express.Router();

// custom controllers
var SongController 	= require('../../app/controllers/SongController');
var FavouriteController 	= require('../../app/controllers/FavouriteController');

// login routes
router.get('/hot', SongController.hot);
router.get('/trending', SongController.trending);
router.get('/featured', SongController.featured);
router.get('/:id', SongController.getById);
router.post('/fav/add/:id', FavouriteController.add)
router.post('/fav/remove/:id', FavouriteController.remove)

// 404 response
router.get('*', function(req, res){
  res.status(404).json({error:'Resource not found'});
});

module.exports = router;