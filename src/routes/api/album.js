var express = require('express');
var router = express.Router();

// custom controllers
var AlbumController 	= require('../../app/controllers/AlbumController');

// login routes
router.get('/all', AlbumController.all);
router.get('/:id', AlbumController.getById);

// 404 response
router.get('*', function(req, res){
  res.status(404).json({error:'Resource not found'});
});

module.exports = router;