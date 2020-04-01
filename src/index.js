const express = require('express')
var path = require('path');
const bodyParser = require("body-parser");
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var session = require('express-session');
var expressValidator = require("express-validator");
var methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
var fs = require('fs')
var morgan = require('morgan')
var rfs = require('rotating-file-stream')
const addRequestId = require('express-request-id')();

const docs = express()
const app = express()

const { PORT } = require('./config/app')

const docRoute = require('./routes/docs.js')
var appRoute = require('./routes/index.js')
var userRoute = require('./routes/user.js')


// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
})
// create a rotating write stream
var errorLogStream = rfs.createStream('error.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
})
app.use(addRequestId);

morgan.token('id', function getId(req) {
    return req.id
});

var loggerFormat = ':id [:date[web]] ":method :url" :status :response-time';
var EloggerFormat = ':id [:date[web]] ":method :url" :status :response-time';

app.use(morgan(EloggerFormat, {
    skip: function (req, res) {
        // console.log(res)
        return res.statusCode >= 400
    },
    stream: errorLogStream
}));

app.use(morgan(loggerFormat, {
    skip: function (req, res) {
        return res.statusCode < 400
    },
    stream: accessLogStream
}));

// const artistRoute = require('./routes/artist.js')

// enable files upload
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 },
  abortOnLimit:true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// adding Helmet to enhance your API's security
app.use(helmet());
var allowedOrigins = ['http://localhost:4200',
                      'https://altostream.app', 
                      'https://staging.altostream.app'
                    ];
// enabling CORS for all requests
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
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


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500).json({error:err.message});
});

// userRoute()
// docRoute(docs)
// artistRoute(artist)
app.use('/aa', appRoute)
app.use('/', docRoute)
app.use('/user/api/v1', userRoute)
// app.use('/artist/api/v1/', artist)


var server = app.listen(PORT, function () {
    console.log("app running on port.", server.address().port);
});