const cookieParser = require('cookie-parser');
const session = require('express-session')
const { NODE_ENV, A_SESS_NAME, A_SESS_LIFETIME, A_SESS_SECRET } = require('../config/app')

const IN_PROD = NODE_ENV === 'production'
const { AuthController, SongController, ArtistController, PlaylistController } = require('../app/controllers/artist')
const path = require('path')
var Request = require('../app/requests/authRequest')
var auth = require('../app/middlewares/artist/authMiddleware')

const userRoute = (artist)=>{
    artist.use(session({
        name:A_SESS_NAME,
        resave:false,
        saveUninitialized:false,
        secret:A_SESS_SECRET,
        cookie:{
            maxAge:parseInt(A_SESS_LIFETIME),
            sameSite:true,
            secure:IN_PROD
        }
    }))

    artist.post('/login', Request.validate('login'), AuthController.login);
    artist.post('/register', Request.validate('register'), AuthController.register);
    artist.get('/profile', auth, AuthController.getData);
    artist.post('/logout', auth, AuthController.logout)

    // get All Songs API
    artist.get('/song/', SongController.getByLevel);
    artist.get('/song/:id', SongController.getById);
    artist.post('/song/fav/add/:id', SongController.addToFav)
    artist.post('/song/fav/remove/:id', SongController.removeFromFav)

    // get Playlist API
    artist.get('/playlist/all', PlaylistController.all);
    artist.get('playlist/:id', PlaylistController.getById);
    artist.post('/playlist/new', PlaylistController.newPlaylist);
    artist.post('/playlist/delete', PlaylistController.deletePlaylist);

    // get Artist API
    artist.get('/artist/all', ArtistController.all);
    artist.get('/artist/:id', ArtistController.getById);

    // 404 response
    artist.get('*', function(req, res){
    res.status(404).json({error:'Resource not found'});
    });
  
}

module.exports = userRoute;