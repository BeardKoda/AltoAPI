
var models = require('../../../../models');
const uuidv1 = require('uuid/v1');
var Art = require('../../../helpers/artist')
const general= require('../../../helpers/general')
const S3 = require('../../../helpers/s3')
const { Op } = require("sequelize");

let limit = 20;   // number of records per page
let offset = 0;

/* GET actorController. */
let controller = {
    all:async(req, res)=>{
        let type = req.params.type
        // console.log('here')
        if(type){
            try{
                const data = await models.Artist.findAndCountAll();
                let page = req.query.page;      // page number
                let pages = Math.ceil(data.count / limit);
                offset = limit * (page - 1) || 0;
                const artists = await models.Artist.findAll({
                    attributes: ['uuid', 'id', 'name', 'created_at', [models.sequelize.fn("COUNT", models.sequelize.col("songs.uuid")), "songCount"]],
                    limit: limit,
                    offset: offset,
                    distinct: true,
                    subQuery: false,
                    where: {
                        status: 1,
                        is_deleted:0,
                    },
                    include: [
                        {model:models.Artist_Profile, as:'profile', attributes:['avatar', 'full_name', 'stage_name','country','city','genre', 'dob','bio'], required:true},
                        {model:models.Song, as:'songs',attributes:[]},
                        {model:models.Album, as:'albums', attributes:['uuid', 'title']}
                    ],
                    // order:models.sequelize.literal('songCount DESC'),
                    $sort: { id: 1 },
                    group: ['songs.status'],
                });
                let response = {
                    page,
                    pages,
                    offset,
                    artists
                };
                return res.status(200).json(response);
            }catch(err){
                console.log(err)
                res.status(500).json({data:err});
            } 
        }else{
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
                        {model:models.Artist_Profile, as:'profile', attributes:['avatar', 'full_name', 'stage_name','country','city','genre', 'dob','bio']},
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
                return res.status(200).json(response);
            }catch(err){
                res.status(500).json({data:"Internal Server Error"});
            } 
        }
    },

    featured:async(req,res)=>{
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
                    {model:models.Artist_Profile, as:'profile', attributes:['avatar', 'full_name', 'stage_name','country','city','genre', 'dob','bio']},
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
            return res.status(200).json(response);
        }catch(err){
            res.status(500).json({data:"Internal Server Error"});
        } 
    },

    getById:async(req, res)=>{
        let uid = req.params.id
        // let user = art.Artist(uid)
        if(uid!=null){ 
        // console.log(uid)
            models.Artist.findOne({
                where:{uuid:uid, status:1},
                attributes:['uuid', 'id', 'name', ['cover_img','image'], 'premium'],
                include: [
                    {model:models.Artist_Profile, as:'profile', attributes:['avatar', 'full_name', 'stage_name','country','city','genre', 'dob','bio']},
                    {model:models.Song, as:'songs',where:{status:{[Op.ne]:0}, title:{[Op.ne]:null}}, attributes:[['uuid','id'], 'title', 'featuring', 'duration'], required: false,include: [{
                        model:models.Artist, as:'artist', include:[
                            {model:models.Artist_Profile, as:'profile', attributes:['avatar', 'full_name', 'stage_name','country','city','genre', 'dob','bio']}
                        ]
                    }]
                    },
                    {model:models.Album, as:'albums', attributes:['uuid','title', ['cover_img','image']], where:{status:1},required: false}
                ]
            }).then(
                data =>{
                    console.log(data)
                    return res.status(200).json(data);
                }
            )
        }else{
            return res.status(202).json(null)
        }
    },

    updateProfile:async(req,res, next)=>{
        const { full_name, stage_name, genre, dob, city, country, bio } = req.body
        const artist = await models.Artist.findOne({where:{user_id:res.user.id}});
        try{
            let avatar = req.files.cover;
            let name = artist.uuid+'/images/'+Date.now()+'_profile';
            image_path = `src/public/uploads/`+name
            const file = avatar.data
            S3.upload(file, name,async(err,result)=>{
                if(err){
                    // console.log(err)
                    res.status(422).json({
                        message:'An Error Occurred',
                        data:null
                    })
                }

                data ={ full_name, stage_name, genre, dob, city, country, bio, avatar:name, artist_id:artist.id}
                updated = await general.updateOrCreate(models.Artist_Profile, {artist_id:artist.id},data)
                    res.status(200).json({
                        status:'finished',
                        message: 'Profile Updated',
                        data:null
                    })
                })
        }catch(err){
            res.status(500).json({data:"Internal Server Error"});
            throw new Error(err)
        } 
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
                models.Artist.create({name : data.name, email : data.email,user_id:saved.id, password : data.password, status:1, premium:0,is_deleted:false, uuid:uuidv1()}).then((user) => {
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
        try{
            var data = await Art.artist(res.user)
            let uid = data.id
            let recent =await models.Song.findAll({
                limit: 5,
                offset:0,
                distinct: true,
                subQuery: false,
                where:{artist_id:uid, is_deleted:0}, 
                attributes:{include:['uuid', 'id', 'title', 'description', 'cover_img', 'status', 'created_at', [models.sequelize.fn("COUNT", models.sequelize.col("streams.song_id")), "streamCount"]]},
                include: [
                    {model: models.Stream, as:'streams', attributes: []},
                    {model:models.Artist, as:'artist', attributes:['uuid'], 
                    include:[{model:models.Artist_Profile, as:'profile', attributes:[['stage_name', 'name']]}]},
                    {model:models.Genre, as:'genres', attributes:['uuid', 'name']}
                ],
                group: ['Song.id'],
            })
            c_songs = await models.Song.count({where:{artist_id:uid, is_deleted:0}})
            c_stream = await models.Stream.count({include:{model:models.Song, as:'Song',where:{artist_id:uid, is_deleted:0}}})
            c_albums = await models.Album.count({where:{artist_id:uid}})
            response = {
                songs:c_songs, albums:c_albums, streams:c_stream,
                recent
            }
            return res.status(200).json(response);
        }catch(err){
          console.log(err)  
          return res.status(400).json(err);
        }
    },

    getSongs:async(req, res)=>{
        var art = await Art.artist(res.user)
        let uid = art.id
        const data = await models.Song.findAndCountAll({where:{artist_id:uid, is_deleted:0}, attributes:['id']});
        console.log(data)
        let page = req.query.page || 1;      // page number
        let pages = Math.ceil(data.count / limit);
        offset = limit * (page - 1) || 0;
        var songs = await models.Song.findAll({
            where:{artist_id:uid, is_deleted:0},
            distinct: true,
            subQuery: false,
            limit: limit,
            offset: offset,
            order: [['created_at', 'DESC']],
            attributes:[['uuid','id'], 'title', 'description', 'cover_img', 'featuring', 'producers','status', 'type', 'year', 'price', 'updated_at',[models.sequelize.fn("COUNT", models.sequelize.col("streams.song_id")), "streamCount"]], include:[
                {model: models.Stream, as:'streams', attributes: []},
                {model:models.Artist, as:'artist', attributes:['uuid'], include:[
                    {model:models.Artist_Profile, as:'profile', attributes:[['stage_name', 'name']]}
                ]}
            ],
            group: ['Song.id'],
        })
        var response = {
            songs,
            page,
            pages,
            offset,
        }
        return res.status(200).json(response);
    },

    getBySongId:async(req, res)=>{
        let uid = req.params.id
        console.log(uid)
        models.Song.findOne({
            where:{uuid:uid},
            attributes:['id','title', 'genre', 'description', 'cover_img', 'release', 'duration', 'year',  'type'],
            include:[{model:models.Album, as:'album', attributes:['uuid', 'title']},
            {model:models.Artist, as:'artist', attributes:['uuid', 'name'], include:{model:models.Artist_Profile, as:'profile', attributes:['stage_name']}}]
        }).then(
            song =>{
                res.status(200).json({data:song});
            }
        )
        // return res.send('Welcome');
    },

    publish:async(req, res)=>{
        // console.log("wowo")
        let uid = req.params.id
        let me = await Art.artist(res.user)
        console.log(res.user.id, me.id, uid)
        models.Song.update({status:1},{where:{uuid:uid, artist_id:me.id}}).then(data=>{
            // console.log(data)
            return res.status(200).json({data:"Successfully Published Song"})
        })
    },

    unPublish:async(req, res)=>{
        let uid = req.params.id
        // let me = parseInt(res.user.id)
        let me = await Art.artist(res.user)
        models.Song.update({status:0},{where:{uuid:uid, artist_id:me.id}}).then(data=>{
            // console.log("herer")
            return res.status(200).json({data:"Successfully Unpublished Song"})
        })
    },

    getData:async(req, res)=>{
        let me = await Art.artist(res.user)
        let _idd = me.id
        user = await models.Artist.findOne({where:{id:_idd}, include:{model:models.Artist_Profile,as: 'profile'}})
        return res.status(200).json({ data: user });
    },
  
}
module.exports = controller;