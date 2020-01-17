const path = require('path')
var models = require('../../../models');
const mm = require('music-metadata');
const util = require('util');
var base64Img = require('base64-img');

/* GET actorController. */
let controller = {
upload:async (req, res) => {    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({message:'No files were uploaded.'});
    }
    if(!req.files.audio.mimetype.includes('audio') ){
        return res.status(400).json({message:'File type not supported Required.'});
    }
    else {
            try {
                    let avatar = req.files.audio;
                    let name = Date.now()+'_'+avatar.name;
                    await avatar.mv(`src/public/uploads/` + name);
                    metadata = await mm.parseFile(`src/public/uploads/`+name)
                    // image = util.inspect(metadata, { showHidden: false, depth: null })
                    // console.log(metadata.common.picture)
                    // var base64String = "";
                    // for (var i = 0; i < image.data.length; i++) {
                    //     console.log("here")
                    //     base64String += String.fromCharCode(image.data[i]);
                    // }
                    // var base64 = "data:" + image.format + ";base64," +
                    //         window.btoa(base64String);
                    // console.log(base64)
                    // base64Img.img(base64, `src/public/uploads`, '1', function(err, filepath) {
                    //     console.log(err, filepath)
                    // });
                    // console.log(metadata.common.picture.data);
                    let artist = await models.Artist.findOne({where:{user_id:res.user.id}});
                    models.Song.create({artist_id: artist.id, track_url:name, title:metadata.common.title, year:metadata.common.year, duration:metadata.format.duration, }).then((data) =>{
                        //send response
                        res.status(200).json({
                            status:"finished",
                            message: 'File is uploaded',
                            data: {
                                song:data,
                                name: avatar.name,
                                mimetype: avatar.mimetype,
                                size: avatar.size,
                                // cover_img:JSON.stringify(metadata.common.picture)
                            }
                        })
                    }, err=>{
                        console.log(err)
                        res.status(422).json({
                            message:"an Error occurred"
                        })
                    })
            } catch (err) {
                res.status(500).send(err);
            }
        }
    },
    uploadData:async(req,res, next)=>{
        let uid = parseInt(req.params.id)
        const { title, genre, cover, featuring, producers, release, description } = req.body
        // console.log(req.body, req.files)
        try{
            let avatar = req.files.cover;
            let name = Date.now()+'_'+avatar.name;
            await avatar.mv(`src/public/uploads/` + name);
            data ={title, genre, featuring,producers,release, description, cover_img:name}
            models.Song.update(data,{where:{id:uid}}).then((resp)=>{
                res.status(200).json({
                    message: 'Song Updated',
                    data:null
                })
            })
        }catch(err){
            res.status(500).json({data:"Internal Server Error"});
        } 
    }
}

module.exports = controller;