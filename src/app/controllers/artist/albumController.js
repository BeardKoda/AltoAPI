
var models = require('../../../models');

let limit = 50;   // number of records per page
let offset = 0;

/* GET actorController. */
let controller = {
    all:async(req, res)=>{
        // return res.send(req.query);
        try{
            const data = await models.Artist.findAndCountAll();
            let page = req.query.page;      // page number
            let pages = Math.ceil(data.count / limit);
            offset = limit * (page - 1) || 0;
            const artists = await models.Artist.findAll({
                attributes: ['id', 'name'],
                limit: limit,
                offset: offset,
                where: {
                    status: "active",
                    is_deleted:0,
                },
                include: [
                    {model:models.Song, as:'songs', attributes:['id', 'title']},
                    {model:models.Album, as:'albums', attributes:['id', 'title']}
                ],
                $sort: { id: 1 }
            });
            let response = {
                page,
                pages,
                offset,
                artists
            };
            return res.status(200).json({data:response});
        }catch(err){
            res.status(500).json({data:"Internal Server Error"});
        } 
    },
    getById:async(req, res)=>{
        let uid = parseInt(req.params.id)
        // return res.send(req.params.id);ss
        models.Artist.findOne({
            where:{id:uid, status:"active"},
            attributes:['id', 'name', 'cover_img', 'premium'],
            include: [
                {model:models.Song, as:'songs', attributes:['id', 'title']},
                {model:models.Album, as:'albums', attributes:['id', 'title']}
            ]
        }).then(
            data =>{
                return res.status(200).json({data:data});
              }
        )
    },
    newPlaylist:async(req, res)=>{
        let userId = parseInt(req.params.userId)
        let title = req.params.title
        let description = req.params.description
        // return res.send(req.params.id);ss
        models.Playlist.create({ title: title, description:description, user_id:userId})
        .then(data =>{
            return res.status(200).json({data:"Added to favourite"});
        })
    },
    addToPlaylist:async(req, res)=>{
        let uid = parseInt(req.params.id)
        let song_id =parseInt(req.params.song_id)
        let playlist_id =parseInt(req.params.playlist_id)
        // return res.send(req.params.id);ss
        models.P_Item.create({ song_id: song_id, user_id: 3, status:true, playlist_id:playlist_id }).then(data =>{
            return res.status(200).json({data:"Added to playlist"});
        })
    },
    removeFromPlaylist:async(req, res)=>{
        let uid = parseInt(req.params.id)
        let song_id =parseInt(req.params.song_id)
        let playlist_id =parseInt(req.params.playlist_id)
        // return res.send(req.params.id);
        models.P_Item.update({ is_deleted:true },{where:{id:uid, playlist_id:playlist_id, song_id:song_id}}).then(data =>{
                return res.status(200).json({data:"Remove from playlist"});
        })
    },
    deletePlaylist:async(req, res)=>{
        let uid = parseInt(req.params.id)
        models.Playlist.update({}).then(
            data => {
            models.P_Item.update({ is_deleted:true },
                {where:{playlist_id:playlist_id, song_id:song_id}}).then(data =>{
                return res.status(200).json({data:"Deleted playlist"});
            })
        });
    }

}
module.exports = controller;