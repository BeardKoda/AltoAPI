
var models = require('../../../../models');
const uuidv1 = require('uuid/v1');
var Art = require('../../../helpers/artist')

let limit = 10;   // number of records per page
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

    register:async(req, res, next)=>{
        saved = res.user
        // console.log(saved.id)
        try{
        data = await models.User.findOne({where:{id:saved.id}})
        // console.log(data, "here")
            models.Artist.findOne({where:{email:data.email}}).then(user => {
                // console.log(data.email, "here")
                if(!user){
                models.Artist.create({name : data.name, email : data.email,user_id:saved.id, password : data.password, status:"active", premium:0,is_deleted:false, uuid:uuidv1()}).then((user) => {
                    if(user){
                        models.User.update({is_artist:true},{where:{id:saved.id}}).then(data=>{
                            return res.status(200).json({ response: "Registered as artist"});
                        })
                    }
                    },
                    (err) => {
                    return res.status(500).json("There was a problem creating as artist.")
                    })
                }
                if(user){
                    models.User.update({is_artist:true},{where:{id:saved.id}}).then(data=>{
                        return res.status(200).json({ response: "Registered as artist"});
                    })
                }
                },err => {
                res.status(500).json({
                    error: err
                })
            })
        }catch(err) {
            console.log(err)
            return res.status(422).json({error:err})
        }
    },

    getDash:async(req,res,next)=>{
        var data = await Art.artist(res.user)
        console.log(data.id)
        let uid = data.id
        artist = await models.Artist.findOne({
            where:{id:uid, status:"active"}, attributes:['id']})
        recent = await models.Song.findAll({attributes:['id', 'title', 'description', 'track_url', 'cover_img', 'status', 'created_at'],
            limit: 5,where:{artist_id:data.id}})
        c_songs = await models.Song.count({where:{artist_id:data.id}})
        c_stream = 0
        c_albums = await models.Album.count({where:{artist_id:data.id}})
        // console.log(c_songs)
        response = {
            songs:c_songs, albums:c_albums, streams:c_stream,
            recent
        }
        return res.status(200).json(response);

    },

    getSongs:async(req, res)=>{
        var art = await Art.artist(res.user)
        let uid = art.id
        const data = await models.Song.findAndCountAll({where:{artist_id:uid}});
        let page = req.query.page || 1;      // page number
        let pages = Math.ceil(data.count / limit);
        offset = limit * (page - 1) || 0;
        console.log(offset, limit, page)
        // var songs = await models.Artist.findOne({
        //     where:{id:uid, status:"active"},
        //     attributes:['id', 'name', 'cover_img', 'premium'],
        //     limit: limit,
        //     offset: offset,
        //     include: [
        //         {model:models.Song, as:'songs', attributes:['id', 'title', 'description', 'track_url', 'cover_img', 'featuring', 'producers','status', 'type', 'year', 'price', 'genre', 'level', 'updated_at']},
        //         {model:models.Album, as:'albums', attributes:['id', 'title']}
        //     ]
        // })
        var songs = await models.Song.findAll({
            where:{artist_id:uid},
            limit: limit,
            offset: offset,
            attributes:['id', 'title', 'description', 'track_url', 'cover_img', 'featuring', 'producers','status', 'type', 'year', 'price', 'genre', 'level', 'updated_at']
        })
        var response = {
            songs,
            page,
            pages,
            offset,
        }
        return res.status(200).json(response);
    },
}
module.exports = controller;