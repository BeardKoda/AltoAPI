var swaggerUi = require('swagger-ui-express')
// var swaggerDocument = require('../../dist/api-docs.json');
var userJSON =require('../../docs/api-user.json')


docURoute = (doc)=>{
    doc.use('/', swaggerUi.serve, swaggerUi.setup(userJSON));

    // 404 response
    doc.get('*', function(req, res){
        res.status(404).json({error:'Resource not found'});
    });
  
}

module.exports = docURoute