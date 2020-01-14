

appRoute = (app)=>{
    

    // 404 response
    app.get('*', function(req, res){
        res.status(404).json({error:'Resource not found'});
    });
  
}

module.exports = appRoute