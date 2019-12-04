const { body, validationResult } = require('express-validator/check')
var jwt = require('jsonwebtoken');
var models = require('../../models');
const Song = models.Song;

let limit = 50;   // number of records per page
let offset = 0;

/* GET actorController. */
let controller = {
    getById:async(req, res)=>{
        let uid = parseInt(req.params.id)
        const song = await models.Song.findOne({
            where:{id:uid},
            attributes:['id','title', 'price', 'genre', 'track_url', 'cover_img', 'year', 'privacy', 'type'],
            include:[{model:models.Album, as:'album', attributes:['id', 'title']},
            {model:models.Artist, as:'artist', attributes:['id', 'name']}]
        }).then(
            song =>{
                res.status(200).json({data:song});
            }
        )
        // return res.send('Welcome');
    },
    hot:async(req, res)=>{
        // return res.send(req.query);
        try{
            const data = await models.Song.findAndCountAll();
            let page = req.query.page;      // page number
            let pages = Math.ceil(data.count / limit);
            offset = limit * (page - 1) || 0;
            const songs = await models.Song.findAll({
                attributes: ['id', 'title'],
                limit: limit,
                offset: offset,
                where: {
                    status: 1,
                    is_deleted:0,
                    level:"hot"
                },
                $sort: { id: 1 }
            });
            let response = {
                page,
                pages,
                offset,
                songs
            };
            return res.status(200).json({data:response});
        }catch(err){
            res.status(500).json({data:"Internal Server Error"});
        } 
    }, 
    trending:async(req, res)=>{
        try{
            const data = await Song.findAndCountAll();
            let page = req.query.page;      // page number
            let pages = Math.ceil(data.count / limit);
            offset = limit * (page - 1) || 0;
            const songs = await models.Song.findAll({
                attributes: ['id', 'title'],
                limit: limit,
                offset: offset,
                where: {
                    status: 1,
                    is_deleted:0,
                    level:"trending"
                },
                $sort: { id: 1 }
            });
            let response = {
                page,
                pages,
                offset,
                songs
            };
            return res.status(200).json({data:response});
        }catch(err){
            res.status(500).json({data:"Internal Server Error"});
        }
    }, 
    featured:async(req, res)=>{
        try{
            const data = await Song.findAndCountAll();
            let page = req.query.page;      // page number
            let pages = Math.ceil(data.count / limit);
            offset = limit * (page - 1) || 0;
            const songs = await models.Song.findAll({
                attributes: ['id', 'title'],
                limit: limit,
                offset: offset,
                where: {
                    status: 1,
                    is_deleted:0,
                    level:"featured"
                },
                $sort: { id: 1 }
            });
            let response = {
                page,
                pages,
                offset,
                songs
            };
            return res.status(200).json({data:response});
        }catch(err){
            res.status(500).json({data:"Internal Server Error"});
        }
    },
    addToFav:async(req, res)=>{
        let uid = parseInt(req.params.id)
        // return res.send(req.params.id);ss
        models.Favourite.create({ song_id: 2, user_id: 3, status:true }).then(
            data =>{
                return res.status(200).json({data:"Added to favourite"});
              }
        )
    },
    removeFromFav:async(req, res)=>{
        let uid = parseInt(req.params.id)
        models.Favourite.update({status:false},{where:{id:uid}}).then(data=>{
            return res.status(200).json({data:"Removed from favourite"})
        })
    } 
}

module.exports = controller;