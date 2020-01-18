const cookieParser = require('cookie-parser');
const session = require('express-session')
const { NODE_ENV, U_SESS_NAME, U_SESS_LIFETIME, U_SESS_SECRET } = require('../config/app')

const IN_PROD = NODE_ENV === 'production'
const { AuthController, SongController, ArtistController, PlaylistController, UploadController } = require('../app/controllers/user')
const path = require('path')
var Request = require('../app/requests/authRequest')
var auth = require('../app/middlewares/user/authMiddleware')
// user = express()
var user = require('express').Router()

// const userRoute = ()=>{
    user.use(session({
        name:U_SESS_NAME,
        resave:false,
        saveUninitialized:false,
        secret:U_SESS_SECRET,
        cookie:{
            maxAge:parseInt(U_SESS_LIFETIME),
            sameSite:true,
            secure:IN_PROD
        }
    }))

    user.use('/test', (req, res, next)=>{
        res.send("hello")
    })

    user.post('/login', Request.validate('login'), AuthController.login);
    user.post('/register', Request.validate('register'), AuthController.register);
    
    // User Auth
    user.post('/profile', auth, AuthController.getData);
    user.post('/verify-token', auth, AuthController.verifyToken)
    user.post('/logout', auth, AuthController.logout)

    // get All Songs API
    user.get('/song/', SongController.getByLevel);
    user.get('/song/:id', SongController.getById);
    user.post('/song/fav/add/:id', SongController.addToFav)
    user.post('/song/fav/remove/:id', SongController.removeFromFav)
    user.post('/song/upload', auth, UploadController.upload)
    user.post('/song/update/:id',auth, UploadController.uploadData)

    // get Playlist API
    user.get('/playlist/all', PlaylistController.all);
    user.get('playlist/:id', PlaylistController.getById);
    user.post('/playlist/new', PlaylistController.newPlaylist);
    user.post('/playlist/delete', PlaylistController.deletePlaylist);

    // get Artist API
    user.post('/artist/register', auth, ArtistController.register)
    user.get('/artist/all', ArtistController.all);
    user.get('/artist/:id', ArtistController.getById);

    // 404 response
    user.get('**', function(req, res){
        res.status(404).json({error:'Resource not found'});
    });
  
// }

module.exports = user;