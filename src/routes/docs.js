var swaggerUi = require('swagger-ui-express')
var artistJSON =require('../../docs/api-artist.json')
var swaggerDocument = require('../../docs/api-user.json');

docRoute = (doc)=>{
    doc.get('/', (req,res)=>{
        res.redirect('/docs/user/v1')
    })
    doc.use('/docs/:id/v1', swaggerUi.serve,(req,res)=>{
        let a = req.params.id
        if(a==='user'){
            res.status(200).send(swaggerUi.generateHTML(swaggerDocument))}
        if(a==='artist'){
            res.status(200).send(swaggerUi.generateHTML(artistJSON)) }
    });

    // 404 response
    doc.get('*', function(req, res){
        res.status(404).json({error:'Resource not found'});
    });
  
}

module.exports = docRoute