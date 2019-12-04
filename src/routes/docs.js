var express = require('express');
var router = express.Router();
var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('../../dist/api-docs.json');

router.use('/V1', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// router.get('/v1', function (req, res) {
//     res.sendFile(__dirname + '../../dist/index.html');
//   });

// 404 response
router.get('*', function(req, res){
  res.status(404).json({error:'Route not found'});
});


module.exports = router;