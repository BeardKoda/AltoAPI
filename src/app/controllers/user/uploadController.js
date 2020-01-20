const path = require('path')
var models = require('../../../models');
const mm = require('music-metadata');
const util = require('util');
var base64Img = require('base64-img');
const S3 = require('../../helpers/s3')


/* GET actorController. */
let controller = {
    upload:async (req, res) => {
        // console.log(res.user)
        const artist = await models.Artist.findOne({where:{user_id:res.user.id}});
        // console.log(artist)
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({message:'No files were uploaded.'});
        }
        if(!req.files.audio.mimetype.includes('audio') ){
            return res.status(400).json({message:'File type not supported Required.'});
        }
        else {
            try {
                let avatar = req.files.audio;
                let name = artist.uuid+'/music/'+Date.now()+'_'+avatar.name;
                // let music_path = 'src/public/uploads/'+name
                
                metadata = await mm.parseBuffer(avatar.data)
                // S3.upload(avatar.data, name,async(err,result)=>{
                //     if(err){
                //         console.log(err)
                //         res.status(422).json({
                //             message:'An Error Occurred',
                //             data:err
                //         })
                //     }
                //     console.log(result)
                //     models.Song.create({artist_id: artist.id, track_url:name, title:metadata.common.title, year:metadata.common.year, duration:metadata.format.duration, }).then((data) =>{
                //         //send response
                //         res.status(200).json({
                //             status:"finished",
                //             message: 'File is uploaded',
                //             data: {
                //                 song:data,
                //                 name: avatar.name,
                //                 mimetype: avatar.mimetype,
                //                 size: avatar.size,
                //                 // cover_img:JSON.stringify(metadata.common.picture)
                //             }
                //         })
                //     }, err=>{
                //         // console.log(err)
                //         res.status(422).json({
                //             message:"an Error occurred"
                //         })
                //     })
                // })
            } catch (err) {
                res.status(500).send(err);
            }
        }
    },
    uploadData:async(req,res, next)=>{
        let uid = parseInt(req.params.id)
        const { title, genre, cover, featuring, producers, release, description } = req.body
        const artist = await models.Artist.findOne({where:{user_id:res.user.id}});
        try{
            let avatar = req.files.cover;
            let name = artist.uuid+'/images/'+Date.now()+'_'+avatar.name;
            image_path = `src/public/uploads/`+name
            // await avatar.mv(`src/public/uploads/` + name);
            // await avatar.mv(image_path)
            const file = avatar.data
            S3.upload(file, name,async(err,result)=>{
                if(err){
                    // console.log(err)
                    res.status(422).json({
                        message:'An Error Occurred',
                        data:null
                    })
                }
                // console.log(result, "hhh")
                data ={title, genre, featuring,producers,release, description, cover_img:name}
                models.Song.update(data,{where:{id:uid}}).then((resp)=>{
                    res.status(200).json({
                        message: 'Song Updated',
                        data:null
                    })
                })
            })
        }catch(err){
            res.status(500).json({data:"Internal Server Error"});
            throw new Error(err)
        } 
    }
}

module.exports = controller;