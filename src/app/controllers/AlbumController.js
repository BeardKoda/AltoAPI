
var models = require('../../models');

let limit = 50;   // number of records per page
let offset = 0;

/* GET actorController. */
let controller = {
    all:async(req, res)=>{
        // return res.send(req.query);
        try{
            const data = await models.Album.findAndCountAll();
            let page = req.query.page;      // page number
            let pages = Math.ceil(data.count / limit);
            offset = limit * (page - 1) || 0;
            const albums = await models.Album.findAll({
                attributes: ['id', 'title'],
                limit: limit,
                offset: offset,
                where: {
                    status: 1,
                    is_deleted:0,
                },
                $sort: { id: 1 }
            });
            let response = {
                page,
                pages,
                offset,
                albums
            };
            return res.status(200).json({data:response});
        }catch(err){
            res.status(500).json({data:"Internal Server Error"});
        } 
    },
    getById:async(req, res)=>{
        let uid = parseInt(req.params.id)
        // return res.send(req.params.id);ss
        models.Album.findOne({
            where:{id:uid, status:1},
            attributes:['id', 'title', 'description', 'cover_img', 'premium', 'year'],
            include: [
                {model:models.Song, as:'songs', attributes:['id', 'title']}
            ]
        }).then(
            album =>{
                return res.status(200).json({data:album});
              }
        )
    }
}
module.exports = controller;