var models = require('../../../models');
let limit = 50;   // number of records per page
let offset = 0;

/* GET actorController. */
let controller = {
    getById:async(req, res)=>{
        let uid = parseInt(req.params.id)
        models.Album.findOne({
            where:{id:uid}, attributes:['id', 'title'],
            include:[
                {model:models.Song, as:'songs', attributes:['id','title', 'price', 'genre', 'track_url', 'cover_img', 'year', 'status', 'type']},
                {model:models.Artist, as:'artist', attributes:['id', 'name']}
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
                limit: 10, attributes:['id', 'title', 'created_at'],
                order:[[ 'created_at', 'DESC' ]], 
                where: {
                    status: 1,
                    is_deleted:0,
                    // level:type
                },
                $sort: { id: 1 },
                include: [
                    {
                        model:models.Song, as:'songs', attributes:['id', 'title',['track_url','fileName'], ['title','originalfileName'], ['cover_img','image'], 'featuring', 'producers','status', 'type', 'year', 'price'], 
                        order:[[ 'created_at', 'DESC' ]]
                    },
                    {model:models.Artist, as:'artist', attributes:['id', 'name']}
                ]
            });
            return res.status(200).json(songs);
        }else{
            const songs = await models.Album.findAll({
                limit: 10, attributes:['id', 'title'],
                where: {
                    status: 1,
                    is_deleted:0,
                    // level:type
                },
                $sort: { id: 1 },
                include: [
                    {
                        model:models.Song, as:'songs', attributes:['id', 'title',['track_url','fileName'], ['title','originalfileName'], ['cover_img','image'], 'featuring', 'producers','status', 'type', 'year', 'price'], 
                    },
                    {model:models.Artist, as:'artist', attributes:['id', 'name']}
                ]
            });
            return res.status(200).json(songs);
        }
    },
}

module.exports = controller;