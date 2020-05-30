var models = require('../../../models');
let limit = 5;   // number of records per page
let offset = 0;
const { Op } = require("sequelize");

/* GET actorController. */
let controller = {
    search:async(req, res)=>{
        let query = req.query.q || req.query.query
        // console.log(query)
        if(query){
            const artists = await models.Artist.findAll({
                attributes: ['id', 'name', ['cover_img', 'image']],
                limit: limit,
                offset: offset,
                where: {
                    status: 1,
                    is_deleted:0,
                    name: {
                        [Op.like]:  '%'+query+'%'
                    }
                },
                $sort: { id: 1 },
                include:[{model:models.Artist_Profile, as:'profile', required:true, attributes:['stage_name']}]
            });
            const songs = await models.Song.findAll({
                attributes: ['id', 'title', ['cover_img', 'image']],
                limit: limit,
                offset: offset,
                where: {
                    is_deleted:0,
                    status:{[Op.ne]:0},
                    title: {[Op.like]: '%'+query+'%'}
                },
                include: [
                    {model:models.Artist, as:'artist',  attributes:[['uuid','id'], 'name'], include:[{model:models.Artist_Profile, as:'profile', required:true, attributes:['stage_name']}]},
                    {model:models.Album, as:'album', attributes:['id', 'title']}
                ],
                $sort: { id: 1 }
            });
            const albums = await models.Album.findAll({
                attributes: ['id', 'title', 'cover_img'],
                limit: limit, offset: offset, where: { status: 1, is_deleted:0, title: { [Op.like]: '%'+query+'%'}},
                $sort: { id: 1 }
            });
            // console.log(albums)
            let data ={
                    songs:songs,
                    albums:albums,
                    artists:artists
            }
            res.status(200).json({data})
        }else{
            res.status(422).json([null])
        }
    }
}

module.exports = controller;