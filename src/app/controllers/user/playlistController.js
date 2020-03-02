
var models = require('../../../models');

let limit = 50;   // number of records per page
let offset = 0;

/* GET actorController. */
let controller = {
    all:async(req, res)=>{
        let uid = parseInt(res.user.id)
        // return res.send(req.query);
        try{
            const data = await models.Playlist.findAndCountAll();
            let page = req.query.page;      // page number
            let pages = Math.ceil(data.count / limit);
            offset = limit * (page - 1) || 0;
            // console.log(data.count)

            const playlists = await models.Playlist.findAll({
                attributes: ['id', 'title', 'description'],
                limit: limit,
                offset: offset,
                where: {
                    user_id:uid,
                    status:true,
                    is_deleted:false,
                },
                include: [
                    {model:models.P_Item, as:'songs', attributes:['id'], 
                        // include:[
                        // { model:models.Song, as:'detail', attributes:['title', 'track_url']}
                        // ]
                    },
                ],
                $sort: { id: 1 }
            });
            
            let response = {
                page,
                pages,
                offset,
                playlists
            };

            return res.status(200).json({data:response});
        }catch(err){
            // console.log(err)
            res.status(500).json({data:"Internal Server Error"});
        } 
    },

    getById:async(req, res)=>{
        let userId = parseInt(res.user.id)
        let uid = parseInt(req.params.id)
        try{
            models.Playlist.findOne({
                where:{user_id:userId, id:uid, status:true},
                attributes:['id', 'title', 'description'],
                include: [
                    {model:models.P_Item, as:'songs', attributes:['id'], 
                    include:[
                        { model:models.Song, as:'detail', attributes:['title', 'track_url']}
                    ]}
                ]
            }).then(
                data =>{
                    return res.status(200).json({data:data});
                }
            )
        }catch(err){
            // console.log(err)
            res.status(500).json({data:"Internal Server Error"});
        } 
    },

    newPlaylist:async(req, res)=>{
        let userId = parseInt(res.user.id)
        const {title, description} = req.body
        // console.log(title, description, userId)
        
        models.Playlist.create({ title: title, description:description, user_id:userId, status:true, is_deleted:false})
        .then(data =>{
            return res.status(200).json({data:"Created New Playlist"});
        })
    },

    addToPlaylist:async(req, res)=>{
        let uid = parseInt(res.user.id)
        // let song_id =parseInt(req.params.song_id)
        // let playlist_id =parseInt(req.params.playlist_id)
        const {song_id, playlist_id} = req.body
        console.log(song_id, playlist_id, uid)

        let exists = await models.P_Item.findAndCountAll({where:{song_id:song_id, user_id:uid, playlist_id:playlist_id}})
        // console.log(exists.count)
        if(exists.count < 1){
            // return res.send(req.params.id);ss
            models.P_Item.create({ song_id: song_id, user_id: uid, status:true, playlist_id:playlist_id, is_deleted:false}).then(data =>{
                return res.status(200).json({data:"Successfully Added Song to playlist"});
            })
        }else{
            models.P_Item.update({is_deleted:false}, {where:{song_id:song_id, user_id:uid, playlist_id:playlist_id}}).then((result)=>{
                return res.status(200).json({data:"Successfully Added Song to playlist"});
            })
        }
        
    },

    removeFromPlaylist:async(req, res)=>{
        let uid = parseInt(res.user.id)
        const {song_id, playlist_id} = req.body
        // return res.send(req.params.id);
        models.P_Item.update({ is_deleted:true },{where:{user_id:uid, playlist_id:playlist_id, song_id:song_id}}).then(data =>{
            return res.status(200).json({data:"Successfully Removed Song from playlist"});
        })
    },

    deletePlaylist:async(req, res)=>{
        let uid = parseInt(req.params.id)
        let userId = parseInt(res.user.id)
        models.Playlist.update({}, {where:{id:uid, user_id:userId}}).then(
            data => {
            models.P_Item.update({ is_deleted:true },
                {where:{playlist_id:playlist_id, song_id:song_id}}).then(data =>{
                return res.status(200).json({data:"Successfully Deleted playlist"});
            })
        });
    }

}
module.exports = controller;