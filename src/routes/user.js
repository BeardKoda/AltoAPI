const { NODE_ENV } = require('../config/app')
const { AuthController, SongController, ArtistController, SearchController, AlbumController, PlaylistController, UploadController, GenreController,StreamController, FavController } = require('../app/controllers/user')
var Request = require('../app/requests/authRequest')
var uploadRequest = require('../app/requests/uploadRequest')
var auth = require('../app/middlewares/user/authMiddleware')

var multer  = require('multer')
const path = require('path')
const IN_PROD = NODE_ENV === 'production'

// user = express()
var user = require('express').Router()

    user.post('/login', Request.validate('login'), AuthController.login)
    user.post('/register', Request.validate('register'), AuthController.register)
    user.post('/password/forgot', AuthController.sendPasswordLink)
    user.post('/password/verify/:token',AuthController.verifyReset)
    user.post('/password/reset/:token', Request.validate('reset'), AuthController.resetPassword)
    user.post('/sendmail', AuthController.sendmail)
    user.post('/account/resend', AuthController.resendVerification)
    user.post('/account/verify/:token', AuthController.verifyAccount)
    
    // User Auth
    user.get('/get/profile', auth, AuthController.getData)
    user.post('/profile', auth, AuthController.updateProfile)
    user.post('/validate-login', auth, AuthController.refreshToken)
    user.get('/ping', auth, AuthController.ping)
    user.post('/logout', auth, AuthController.logout)

    // get All Songs API
    user.get('/song/:level', SongController.getByLevel);
    user.get('/song/all', auth, SongController.getSongs);
    user.get('/song/free/all', auth, SongController.getFreeSongs);
    // user.get('/get/home-page-collection', SongController.getALL);
    user.get('/song/detail/:id', SongController.getById);
    user.get('/song/artist/:id', SongController.getByArtist);
    user.post('/song/fav/add/:id',auth, FavController.addToFav)
    user.post('/song/fav/remove/:id',auth, FavController.removeFromFav)
    user.get('/song/fav/all',auth, FavController.getAll)

    // user.post('/play/:path', auth, SongController.playUrl)
    user.post('/play', auth, SongController.playUrl)

    // get Playlist API
    user.get('/playlist/all',auth, PlaylistController.all);
    user.get('/playlist/featured',auth, PlaylistController.getFeatured);
    user.get('/playlist/get/:id', auth, PlaylistController.getById);
    user.post('/playlist/new', auth, PlaylistController.newPlaylist);
    user.post('/playlist/song/add', auth, PlaylistController.addToPlaylist);
    user.post('/playlist/song/remove', auth, PlaylistController.removeFromPlaylist);
    user.delete('/playlist/delete', auth, PlaylistController.deletePlaylist);

    // record Stream
    user.post('/song/:id/stream', auth, StreamController.addStream);

    // genre 

    // Artist details
    user.post('/artist/register', auth, ArtistController.register) //artist registration
    user.post('/artist/profile', auth, ArtistController.updateProfile) //artist profile update
    user.get('/artist/get/profile', auth, ArtistController.getData)
    user.get('/artist/dash', auth, ArtistController.getDash) //atist dashboard detail
    user.get('/artist/songs', auth, ArtistController.getSongs) //artist songs
    user.get('/artist/:type', ArtistController.all);
    user.get('/artist/load/:id', ArtistController.getById);
    user.get('/artist/song/:id', auth, ArtistController.getBySongId);
    user.post('/artist/song/publish/:id', auth, ArtistController.publish)
    user.post('/artist/song/unpublish/:id', auth, ArtistController.unPublish)

    // Album details
    user.get('/album/:type',  AlbumController.getAll);
    user.get('/album/load/:id', AlbumController.getById);

    // Genre
    user.get('/genre/featured', GenreController.getALL)
    user.get('/genre/songs/:genre', GenreController.getByGenre);
    // user.get('/genres', AlbumController.genres)
    // Search
    user.get('/search', SearchController.search)

    // get Artist API - for uploading and artist services analytics
    user.post('/file/upload', auth, UploadController.uploadFile)  //artist song upload
    user.post('/song/upload', auth, UploadController.upload)    //artist song upload
    user.post('/song/update/:id',auth, UploadController.uploadData) //artist song update
    user.post('/album/upload',[uploadRequest.validate('albumUpload'), auth], UploadController.uploadAlbum)    //artist song upload

    // 404 response
    user.get('**', function(req, res){
        res.status(404).json({error:'Resource not found'});
    });
  
// }

module.exports = user;