var express = require('express');
var router = express.Router();

// custom controllers
var PlaylistController 	= require('../../app/controllers/PlaylistController');
var FavouriteController 	= require('../../app/controllers/FavouriteController');

// login routes
router.get('/all', PlaylistController.all);
router.get('/:id', PlaylistController.getById);
router.post('/new', PlaylistController.newPlaylist);
router.post('/delete', PlaylistController.deletePlaylist);

// 404 response
router.get('*', function(req, res){
  res.status(404).json({error:'Resource not found'});
});

module.exports = router;