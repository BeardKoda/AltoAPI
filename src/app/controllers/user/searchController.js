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
                attributes: ['id', 'name', 'cover_img'],
                limit: limit,
                offset: offset,
                where: {
                    status: 1,
                    is_deleted:0,
                    name: {
                        [Op.like]: query+'%'
                      }
                },
                $sort: { id: 1 }
            });
            const songs = await models.Song.findAll({
                attributes: ['id', 'title', 'cover_img'],
                limit: limit,
                offset: offset,
                where: {
                    status: 1,
                    is_deleted:0,
                    title: {[Op.like]: query+'%'}
                },
                include: [
                    {model:models.Artist, as:'artist', attributes:['id', 'name']},
                    {model:models.Album, as:'album', attributes:['id', 'title']}
                ],
                $sort: { id: 1 }
            });
            const albums = await models.Album.findAll({
                attributes: ['id', 'title', 'cover_img'],
                limit: limit, offset: offset, where: { status: 1, is_deleted:0, title: { [Op.like]: query+'%'}},
                $sort: { id: 1 }
            });
            // console.log(albums)
            let data = [
                {
                    songs:songs,
                    albums:albums,
                    artist:artists
                }
            ]
            res.status(200).send(data)
        }else{
            res.status(422).send([null])
        }
    }
}

module.exports = controller;