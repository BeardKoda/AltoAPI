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

const app = express()
const docs = express()
const user = express()
const artist = express()
const { APP_NAME, USER_URL, ARTIST_URL, PORT } = require('./config/app')

const appRoute = require('./index.js')
const docRoute = require('./routes/docs.js')
const userRoute = require('./routes/user.js')
const artistRoute = require('./routes/artist.js')

// enable files upload
app.use(fileUpload({
  createParentPath: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500).json({error:err.message});
  });

app.use('/', docs)
app.use('/user/api/v1/', user)
app.use('/artist/api/v1/', artist)

docRoute(docs)
userRoute(user)
artistRoute(artist)

var server = app.listen(PORT, function () {
    console.log("app running on port.", server.address().port);
});