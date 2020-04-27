const AuthController = require('./authController')
const SongController = require('./songController')
const PlaylistController = require('./playlistController')
const ArtistController = require('./artist/artistController')
const UploadController = require('./uploadController')
const AlbumController = require('./albumController')
const SearchController = require('./searchController')
const GenreController= require('./genreController')

module.exports = {
    AuthController,
    SongController,
    ArtistController,
    PlaylistController,
    UploadController, AlbumController, SearchController,GenreController
}