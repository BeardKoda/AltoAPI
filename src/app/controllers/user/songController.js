const { body, validationResult } = require('express-validator/check')
var models = require('../../../models');
const { Op } = require("sequelize");

const { S3_URL } = require('../../../config/app')
let limit = 20;   // number of records per page
let offset = 0;
const uuidv1 = require('uuid/v1');

/* GET actorController. */
let controller = {
    getById:async(req, res)=>{
        let uid = req.params.id
        console.log(uid)
        models.Song.findOne({
            where:{uuid:uid},
            attributes:[['uuid','id'],'title', 'genre', 'cover_img', 'duration', 'year',  'type'],
            include:[{model:models.Album, as:'album', attributes:['uuid', 'title']},
            {model:models.Artist, as:'artist', attributes:['uuid', 'name'], include:{model:models.Artist_Profile, as:'profile', attributes:['stage_name']}}]
        }).then(
            song =>{
                res.status(200).json({data:song});
            }
        )
        // return res.send('Welcome');
    },
    
    getByArtist:async(req, res)=>{
        let uid = req.params.id
        // console.log(uid)
        models.Artist.findOne({
            where:{uuid:uid},
            attributes:['uuid','name'],
            include:[{model:models.Song, as:'songs', where:{status:1,
                is_deleted:0, title:{[Op.ne]:null}},
            limit: 10, attributes:[['uuid','id'],'title', 'cover_img', 'year'] }]
        }).then(
            song =>{
                // console.log(song)
                res.status(200).json({data:song});
            }
        )
        // return res.send('Welcome');
    },
    
    getByLevel:async(req, res)=>{
        let label = req.params.level
        // let uid = parseInt(req.params.id)
        try{
            const playlist = await models.Playlist.findOne({attributes:['id'], where: { title:label, status: true }});
            // console.log(playlist.id)
            models.P_Item.findAll({
                where:{playlist_id:playlist.id, status:true},
                attributes:['id'],
                include:[
                    { model:models.Song, as:'detail', where:{status:true, is_deleted:0}, attributes:[['uuid','id'],'title', 'cover_img', 'featuring', 'duration'], include:[
                        {model:models.Artist, as:'artist', attributes:[['uuid','id'], 'name'], required:true, include:[{model:models.Artist_Profile, as:'profile', required:true, attributes:['stage_name']}]}
                    ]}
                ]
            })
            .then(data =>{
                return res.status(200).json(data);
            })
        }catch(err){
            // console.log(err)
            res.status(500).json({data:"Internal Server Error"});
        } 
    },

    // getAPI:async(req,res)=>{
    //     // console.log("hello")
    //     ExtApi.upload('https://veezee.ir/api/v1/get/home-page-collection',(result)=>{
    //         // console.log(result)
    //         res.status(200).json(result)
    //     })
    // },

    getSongs:async(req,res)=>{
        const data = await models.Song.findAndCountAll({attributes:['id'], where:{status:1}});
        let page = req.query.page || 1;      // page number
        let pages = Math.ceil(data.count / limit);
        offset = limit * (page - 1) || 0;
        // console.log(offset)
        const songs = await models.Song.findAll({attributes:[['uuid', 'id'], 'title',['track_url','fileName'], ['title','originalfileName'], ['cover_img','image'], 'featuring', 'producers','status', 'premium', 'type', 'year', 'price'],
            limit: limit,
            offset,
            where: {
                status: true,
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
                where:{uuid:uid},
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

    getFreeSongs:async(req,res)=>{
        const data = await models.Song.findAndCountAll({attributes:['id', 'created_at'],
            where:{
                status: 1,
                is_deleted:0,
                premium:'0',
                title:{ [Op.ne]: null},
                // level:{[Op.ne]:null}
            }
        });
        let page = parseFloat(req.query.page )|| 1;      // page number
        let pages = Math.ceil(data.count / limit);
        limit = parseFloat(req.query.limit) || limit;
        offset = limit * (page - 1) || 0;
        // console.log(offset)
        const songs = await models.Song.findAll({
            attributes:[['uuid','id'], 'title', ['cover_img','image'], 'featuring', 'producers', 'duration'],
            limit,
            offset,
            order:[[ 'created_at', 'DESC' ]], 
            where: {
                status: 1,
                is_deleted:0,
                premium:'0',
                title:{ [Op.ne]: null},
                // level:{[Op.ne]:null}
            },
            $sort: { id: 1 },
            include: [
                {model:models.Album, as:'album', attributes:['id', 'title']},
                {model:models.Artist, as:'artist', attributes:['id', 'name'], required:true,
                include:[{model:models.Artist_Profile, as:'profile', attributes:['stage_name'], required:true}]}
            ]
        });
        let response = {
            limit,
            page,
            pages,
            offset,
            songs
        };
        return res.status(200).json(response);
    },
    
    // addStream:async(req,res)=>{
    //     let uid = req.params.id
    //     let userId = res.user.id
    //     let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    //     console.log(uid, userId, ip)
    //     if(uid!=null){
    //         models.Song.findOne({where:{uuid:uid}, attributes:['id']})
    //         .then(song =>{
    //             if(song){ 
    //                 models.Stream.create({ user_id: userId, song_id:song.id, ipaddress:ip, uuid:uuidv1()})
    //                 .then(data =>{
    //                     // console.log(data)
    //                     res.status(200).json({data:true});
    //                 })
    //             }
    //             else res.status(422).json({data:false});
    //         }).catch(err=>{
    //             console.log(err)})
    //     }else{
    //         // console.log('no path')
    //         res.send('no song is played')
    //     }
    //     // res.status(200).json({ip})
    // }
}

module.exports = controller;