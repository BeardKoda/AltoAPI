var app = require('../../app');
var debug = require('debug')('init:server');
var http = require('http');
var models = require("../../src/models");

var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);

// sync() will create all table if they doesn't exist in database
models.sequelize.sync().then(function () {
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
});

function onError(error) { /* ... */
console.log("An error occured" + error) }
function onListening(val) { /* ... */ 
  console.log('API server started on: ' + port);
}