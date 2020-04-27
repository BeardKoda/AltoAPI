var models = require('../../../models');
const { S3_URL } = require('../../../config/app')
let limit = 50;   // number of records per page
let offset = 0;

/* GET actorController. */
let controller = {
    getByGenre:async(req, res)=>{
        let label = req.params.genre
        const genre = await models.Genre.findOne({attributes:['id', 'name', 'description'], where: { name:label, status: true }});
        // console.log(genre)
        // if(genre==null)
        genre_id = genre!=null ? genre.id : 0

        const data = await models.Song.findAndCountAll({attributes:['id'], where:{status:1, genre:genre_id}});
        let page = req.query.page || 1;      // page number
        let pages = Math.ceil(data.count / limit);
        offset = limit * (page - 1) || 0;
        try{
            const songs = await models.Song.findAll({attributes:['id', 'title', ['cover_img','image'], 'featuring', 'producers', 'duration'],
                limit: limit,
                where: {
                    status: 1,
                    is_deleted:0,
                    genre:genre_id
                    // level:type
                },
                $sort: { id: 1 },
                include: [
                    {model:models.Album, as:'album', attributes:['id', 'title']},
                    {model:models.Artist, as:'artist', attributes:['id', 'name']}
                ]
            });
            let response = {
                genre,
                page,
                pages,
                offset,
                songs
            };
            return res.status(200).json(response);
        }catch(err){

            res.status(500).json({data:err});
        } 
    }
}

module.exports = controller;