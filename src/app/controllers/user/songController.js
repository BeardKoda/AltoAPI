const { body, validationResult } = require('express-validator/check')
var jwt = require('jsonwebtoken');
var models = require('../../../models');
const Song = models.Song;
const {ExtApi, isExisting}  = require('../../helpers/api');
const S3 = require('../../helpers/s3')

const { S3_URL } = require('../../../config/app')
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

    getByLevel:async(req, res)=>{
        // return res.send(req.params);
        let type = req.params.level
        console.log(type)
        // let type = parseInt(req.query.type)
        if(!type){
            res.status(401).json({data: "No song type specified"});
        }
        let exist = isExisting(type)
        if(!exist){
            res.status(401).json({data: "Invalid type specified"});
        } 
        try{
            const data = await models.Song.findAndCountAll({attributes:['id']});
            let page = req.query.page;      // page number
            let pages = Math.ceil(data.count / limit);
            offset = limit * (page - 1) || 0;
            // console.log(data);
            const songs = await models.Song.findAll({
                attributes: ['id', 'title'],
                limit: limit,
                offset: offset,
                where: {
                    status: 1,
                    is_deleted:0,
                    // level:type
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
            res.send(err)
            res.status(500).json({data:"Internal Server Error"});
        } 
    }, 

    // trending:async(req, res)=>{
    //     try{
    //         const data = await Song.findAndCountAll();
    //         let page = req.query.page;      // page number
    //         let pages = Math.ceil(data.count / limit);
    //         offset = limit * (page - 1) || 0;
    //         const songs = await models.Song.findAll({
    //             attributes: ['id', 'title'],
    //             limit: limit,
    //             offset: offset,
    //             where: {
    //                 status: 1,
    //                 is_deleted:0,
    //                 level:"trending"
    //             },
    //             $sort: { id: 1 }
    //         });
    //         let response = {
    //             page,
    //             pages,
    //             offset,
    //             songs
    //         };
    //         return res.status(200).json({data:response});
    //     }catch(err){
    //         res.status(500).json({data:"Internal Server Error"});
    //     }
    // }, 
    // featured:async(req, res)=>{
    //     try{
    //         const data = await Song.findAndCountAll();
    //         let page = req.query.page;      // page number
    //         let pages = Math.ceil(data.count / limit);
    //         offset = limit * (page - 1) || 0;
    //         const songs = await models.Song.findAll({
    //             attributes: ['id', 'title'],
    //             limit: limit,
    //             offset: offset,
    //             where: {
    //                 status: 1,
    //                 is_deleted:0,
    //                 level:"featured"
    //             },
    //             $sort: { id: 1 }
    //         });
    //         let response = {
    //             page,
    //             pages,
    //             offset,
    //             songs
    //         };
    //         return res.status(200).json({data:response});
    //     }catch(err){
    //         res.status(500).json({data:"Internal Server Error"});
    //     }
    // },
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
    },

    getAPI:async(req,res)=>{
        // console.log("hello")
        ExtApi.upload('https://veezee.ir/api/v1/get/home-page-collection',(result)=>{
            // console.log(result)
            res.status(200).json(result)
        })
    },

    getSongs:async(req,res)=>{
        const data = await models.Song.findAndCountAll({attributes:['id']});
        let page = req.query.page || 1;      // page number
        let pages = Math.ceil(data.count / limit);
        offset = limit * (page - 1) || 0;
        // console.log(offset)
        const songs = await models.Song.findAll({attributes:['id', 'title',['track_url','fileName'], ['title','originalfileName'], ['cover_img','image'], 'featuring', 'producers','status', 'type', 'year', 'price'],
            limit: limit,
            where: {
                status: 1,
                is_deleted:0,
                // level:type
            },
            $sort: { id: 1 },
            include: [
                {model:models.Album, as:'album', attributes:['id', 'title'], include:[
                    {model:models.Artist, as:'artist', attributes:['id', 'name']}
                ]}
            ]
        });
        let response = {
            page,
            pages,
            offset,
            songs
        };
        return res.status(200).json(response);
    },

    getALL:async(req,res)=>{
        const songs = await models.Song.findAll({attributes:['id', 'title',['track_url','fileName'], ['title','originalfileName'], ['cover_img','image'], 'featuring', 'producers','status', 'type', 'year', 'price'],
            limit: 10,
            where: {
                status: 1,
                is_deleted:0,
                // level:type
            },
            $sort: { id: 1 },
            include: [
                {model:models.Album, as:'album', attributes:['id', 'title'], include:[
                    {model:models.Artist, as:'artist', attributes:['id', 'name']}
                ]}
            ]
        });
        const album = await models.Album.findAll({
            attributes:['id', 'title', 'cover_img', ],
            limit: 10,
            where: {
                status: 1,
                is_deleted:0,
                // level:type
            },
            include: [
            ],
            $sort: { id: 1 },
        });
        let response = [
            { title: "Hot Tracks", type: "Track", trackList:songs},
            { title: "New Releases", type: "Album", albumList:album}
        ]
        return res.status(200).json(response);
    },

    playUrl:async(req,res)=>{
        let uid = req.query.id
        if(uid!=null){
            const song = await models.Song.findOne({
                where:{id:uid},
                attributes:['track_url'],
                // include:[{model:models.Album, as:'album', attributes:['id', 'title']},
                // {model:models.Artist, as:'artist', attributes:['id', 'name']}]
            }).then(
                song =>{
                    res.status(200).json(S3_URL+song.track_url);
                }
            )
            // res.send(path)
        }else{
            // console.log('no path')
            res.send('no song passed')
        }
    },

    addStream:async()=>{
        let uid = req.query.id
        let userId = res.user.id
        let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        if(uid!=null){
            models.Song.findOne({where:{id:uid}})
            .then(song =>{
                models.Play.create({ userId: userId, song_id:uid, ipaddress:ip})
                .then(data =>{
                    return res.status(200).json({data:true});
                })
            })
        }else{
            // console.log('no path')
            res.send('no song is played')
        }
        // res.status(200).json({ip})
    }
}

module.exports = controller;