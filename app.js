var express = require('express');
var path = require('path');
var reload = require('express-reload')
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var session = require('express-session');
var expressValidator = require("express-validator");
var methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const passport = require('passport');
dotenv.config();

// Api Route File
var api = require('./src/routes/api');

var app = express();
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
// adding Helmet to enhance your API's security
app.use(helmet());

// enabling CORS for all requests
app.use(cors());
app.use(session({secret:"secretpass123456",saveUninitialized: true,resave: true}));

// add validation methods to request
app.use(expressValidator());
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body == 'object' && '_method' in req.body){ 
      var method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/V1', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({error:err.message});
});

module.exports = app; 