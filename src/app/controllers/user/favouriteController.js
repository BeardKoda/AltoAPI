var models = require('../../../models');
const uuidv1 = require('uuid/v1');
const general = require('../../helpers/general')
let limit = 50;   // number of records per page
let offset = 0;

/* GET actorController. */
let controller = {
    getAll:async(req,res)=>{
        const data = await models.Favourite.findAndCountAll({
            attributes:['id'],
            where:{
                status: 1,
                user_id:res.user.id,
            }
        });
        let page = parseFloat(req.query.page )|| 1;      // page number
        let pages = Math.ceil(data.count / limit);
        limit = parseFloat(req.query.limit) || limit;
        offset = limit * (page - 1) || 0;
        const songs = await models.Favourite.findAll({
            distinct: true, subQuery: false,
            limit: 10, limit,
            offset,
            attributes:[],
            where: {
                status: 1,
                user_id:res.user.id,
            },
            include: [
                {
                    model:models.Song, as:'song', attributes:[['uuid','id'], 'title', ['cover_img','image'], 'featuring', 'producers', 'duration'],
                    include: [
                        {model:models.Album, as:'album', attributes:['id', 'title']},
                        {model:models.Favourite, as:'isFav', where:{user_id:res.user.id, status:1}, attributes:[['uuid','id']]},
                        {model:models.Artist, as:'artist', attributes:['id', 'name'], required:true,
                        include:[{model:models.Artist_Profile, as:'profile', attributes:['stage_name'], required:true}]}
                    ]
                
                },
                
            ],
            order:[[ 'created_at', 'DESC' ]], 
            $sort: { id: 1 }
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

    addToFav:async(req, res)=>{
        let uid = req.params.id
        let userId=res.user.id
        let song = await models.Song.findOne({where:{uuid:uid}});
        // console.log(song)
        general.updateOrCreate(models.Favourite, {song_id:song.id, user_id:userId},{ song_id: song.id, user_id: userId, status:true, uuid:uuidv1() }).then(
            data =>{
                console.log(data);
                return res.status(200).json({data:true});
              }
        )
    },

    removeFromFav:async(req, res)=>{
        let uid = req.params.id
        let userId=res.user.id
        let song = await models.Song.findOne({where:{uuid:uid}});
        models.Favourite.update({status:false},{where:{song_id:song.id, user_id:userId}}).then(data=>{
            return res.status(200).json({data:true})
        })
    },
}

module.exports = controller;