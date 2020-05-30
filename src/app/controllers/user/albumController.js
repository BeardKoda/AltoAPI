var models = require('../../../models');
let limit = 50;   // number of records per page
let offset = 0;

/* GET actorController. */
let controller = {
    getById:async(req, res)=>{
        let uid = req.params.id
        // console.log("here", uid)
        models.Album.findOne({
            distinct: true,
            subQuery: false,
            where:{uuid:uid}, 
            attributes:[['uuid','id'],'title', ['cover_img', 'image'], 'created_at'],
            include:[
                {model:models.Song, as:'songs', attributes:[['uuid','id'],'title', ['cover_img', 'image'], 'featuring', 'duration'], order:[[ 'created_at', 'DESC' ]], include:{model:models.Favourite, as:'isFav', where:{user_id:res.user.id, status:1}, attributes:[['uuid','id']]}},
                {model:models.Artist, as:'artist', attributes:[['uuid','id'], 'name'], include:[{model:models.Artist_Profile, as:'profile', required:false, attributes:['stage_name']}]}
            ]
        }).then(
            song =>{
                res.status(200).json({data:song});
            }
        )
        // return res.send('Welcome');
    },

    // getByLevel:async(req, res)=>{
    //     // return res.send(req.params);
    //     let type = req.params.level
    //     // let type = parseInt(req.query.type)
    //     if(!type){
    //         res.status(401).json({data: "No song type specified"});
    //     }
    //     try{
    //         const data = await models.Song.findAndCountAll();
    //         let page = req.query.page;      // page number
    //         let pages = Math.ceil(data.count / limit);
    //         offset = limit * (page - 1) || 0;
    //         // console.log(data);
    //         const songs = await models.Song.findAll({
    //             attributes: ['id', 'title'],
    //             limit: limit,
    //             offset: offset,
    //             where: {
    //                 status: 1,
    //                 is_deleted:0,
    //                 // level:type
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
    //         res.send(err)
    //         res.status(500).json({data:"Internal Server Error"});
    //     } 
    // }, 
    
    getAll:async(req,res)=>{
        let type = req.params.type
        if(type){
            const songs = await models.Album.findAll({
                distinct: true,
                subQuery: false,
                limit: 10, attributes:[['uuid', 'id'], 'title', ['cover_img', 'image'], 'created_at'],
                where: {
                    status: 1,
                    is_deleted:0,
                    // level:type
                },
                include: [
                    {
                        model:models.Song, as:'songs',  attributes:[['uuid','id'],'title', ['cover_img', 'image'], 'featuring', 'duration'], order:[[ 'created_at', 'DESC' ]], include:
                        {model:models.Favourite, as:'isFav', where:{user_id:res.user.id, status:1}, attributes:[['uuid','id']]},
                    },
                    {model:models.Artist, as:'artist', attributes:[['uuid', 'id'], 'name'], required:true, include:[{model:models.Artist_Profile, required:true, as:'profile',attributes:['stage_name']}]}
                ],
                order:[[ 'created_at', 'DESC' ]], 
                $sort: { id: 1 }
            });
            return res.status(200).json(songs);
        }else{
            const songs = await models.Album.findAll({
                limit: 10, attributes:['id', 'title', ['cover_img', 'image'], 'created_at'],
                where: {
                    status: 1,
                    is_deleted:0,
                    // level:type
                },
                $sort: { id: 1 },
                order:[[ 'created_at', 'DESC' ]], 
                include: [
                    {
                        model:models.Song, as:'songs',  attributes:[['uuid','id'],'title', ['cover_img', 'image'], 'featuring', 'duration'], order:[[ 'created_at', 'DESC' ]]

                    },
                    {model:models.Artist, as:'artist', attributes:[['uuid', 'id'], 'name'], include:[{model:models.Artist_Profile, as:'profile', required:false, attributes:['stage_name']}]}
                ]
            });
            return res.status(200).json(songs);
        }
    },

    getFeatured:async(req,res)=>{
        const songs = await models.Album.findAll({
            limit: 10, attributes:['id', 'title'],
            where: {
                status: 1,
                is_deleted:0,
            },
            $sort: { id: 1 },
            include: [
                {
                    model:models.Song, as:'songs', attributes:['id', 'title',['track_url','fileName'], ['title','originalfileName'], ['cover_img','image'], 'featuring', 'producers','status', 'type', 'year', 'price'], include:
                    {model:models.Favourite, as:'isFav', where:{user_id:res.user.id, status:1}, attributes:[['uuid','id']]},
                },
                {model:models.Artist, as:'artist', attributes:['id', 'name']}
            ]
        });
        return res.status(200).json(songs);
    },
}

module.exports = controller;