const path = require('path')
const { body, validationResult } = require('express-validator/check')
var models = require('../../../models');
const mm = require('music-metadata');
const util = require('util');
var base64Img = require('base64-img');
const S3 = require('../../helpers/s3')
const uuidv1 = require('uuid/v1');


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
                let songId=uuidv1()
                let avatar = req.files.audio;
                let name = artist.uuid+'/music/'+Date.now()+'_'+songId;
                // let music_path = 'src/public/uploads/'+name
                
                metadata = await mm.parseBuffer(avatar.data)
                S3.upload(avatar.data, name,async(err,result)=>{
                    if(err){
                        // console.log(err)
                        res.status(422).json({
                            message:'An Error Occurred',
                            data:err
                        })
                    }
                    // console.log(result)
                    models.Song.create({artist_id: artist.id, track_url:name, title:req.body.name||metadata.common.title, year:metadata.common.year, duration:metadata.format.duration, uuid:songId, level:0 }).then((data) =>{
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
                        // console.log(err)
                        res.status(422).json({
                            message:"an Error occurred"
                        })
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
        const artist = await models.Artist.findOne({where:{user_id:res.user.id}});
        try{
            if(req.files){
                let avatar = req.files.cover;
                let name = artist.uuid+'/images/'+Date.now()+'_'+avatar.name;
                // image_path = `src/public/uploads/`+name
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
                    data ={title, genre, featuring, producers, release, description, cover_img:name}
                    console.log(result, "hhh", data)
                    models.Song.update(data,{where:{id:uid}}).then((resp)=>{
                        console.log(resp)
                        res.status(200).json({
                            message: 'Song Updated',
                            data:null
                        })
                    })
                })
            }else{
                    data ={title, genre, featuring, producers,release, description, cover_img:cover}
                    console.log("hhh", data)
                    models.Song.update(data,{where:{id:uid}}).then((resp)=>{
                        console.log(resp)
                        res.status(200).json({
                            message: 'Song Updated',
                            data:null
                        })
                    })
            }
        }catch(err){
            res.status(500).json({data:"Internal Server Error"});
            throw new Error(err)
        } 
    },

    uploadAlbum:async (req, res) => {
        const errors = validationResult(req);
        const { title, description, premium, year, genre, songs, image  }= req.body
        try{
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            console.log(req.body)
            let albumId=uuidv1();
            const artist = await models.Artist.findOne({where:{user_id:res.user.id}});
                models.Album.create({uuid:albumId, artist_id:artist.id, title, description, cover_img, premium, year }).then((data)=>{
                    console.log(data);
                    songs.forEach(async (song) => {
                        try {
                            let songId=uuidv1()
                            let filePath = artist.uuid+'/music/'+Date.now()+'_'+songId;
                            let file = await this.uploadFile(song.data, name)
                            console.log(file, filePath)
                            models.Song.create({artist_id: artist.id, track_url:name, title:req.body.name||metadata.common.title, year:metadata.common.year, duration:metadata.format.duration, uuid:songId, album_id:albumId, level:0 })
                            .then((data) =>{
                                console.log(data)
                                return res.status(200).json(true);
                            }, err=>{
                                console.log(err)
                                return res.status(400).json(err);
                            })

                        }catch(err){
                            console.log(err)
                            return res.status(400).json(err);
                        }
                    });
                }).catch(err=>{
                    console.log(err)
                    return res.status(400).json(err);
                })
        }catch(err){
            console.log(err)
        }
    },

    uploadSong:async (song, artist, {year, cover_img, albumId})=>{
        let songId=uuidv1()
        let avatar = song;
        let name = artist.uuid+'/music/'+Date.now()+'_'+songId;
        // let music_path = 'src/public/uploads/'+name
        
        metadata = await mm.parseBuffer(avatar.data)
        S3.upload(avatar.data, name,async(err,result)=>{
            if(err){
                // console.log(err)
                return {
                    message:'An Error Occurred',
                    data:err
                }
            }
            console.log(result)
            models.Song.create({artist_id: artist.id, track_url:name, title:metadata.common.title, year:year||metadata.common.year, duration:metadata.format.duration, uuid:songId, level:0, album_id:albumId }).then((data) =>{
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
                // console.log(err)
                return {
                    message:"an Error occurred"
                }
            })
        })
    },

    uploadFile:async (req, res) => {
        console.log(req.files)
        if (!req.files.file || Object.keys(req.files).length === 0) {
            return res.status(400).json({message:'No file was uploaded.'});
        }
        const { file } = req.files
        const artist = await models.Artist.findOne({where:{user_id:res.user.id}});
        console.log( file )
        var rand = Math.random().toString(36).substring(7);
        
        let imagePath = file.mimetype.includes('audio')?artist.uuid+'/music/'+Date.now()+'_'+rand : file.mimetype.includes('image')? artist.uuid+'/images/'+Date.now()+'_'+ rand : artist.uuid+'/files/'+Date.now()+'_'+rand;

        let metadata = file.mimetype.includes('audio')? await mm.parseBuffer(file.data):null
        console.log(file.data, imagePath, metadata)
        if(file.mimetype.includes('audio') && metadata.common.picture.length > 0){
           S3.upload(file.data, imagePath,async(err,result)=>{
            if(err){
                console.log(err)
                return res.status(200).json({status:"error"})
            }
            let imagePath2 = file.mimetype.includes('audio')?artist.uuid+'/music/'+Date.now()+'_'+rand : file.mimetype.includes('image')? artist.uuid+'/images/'+Date.now()+'_'+ rand : artist.uuid+'/files/'+Date.now()+'_'+rand;
            S3.upload(metadata.common.picture, imagePath2,async(err,result)=>{
                console.log(err, result)
                return res.status(200).json({status:'finished', 
                    data:{
                        path:imagePath, 
                        meta:{
                            banner:imagePath2
                        }
                    }
                })
            })
        }) 
           
        }else{
            S3.upload(file.data, imagePath,async(err,result)=>{
                if(err){
                    console.log(err)
                    return res.status(200).json({status:"error"})
                }
                return res.status(200).json({status:'finished', 
                    data:{
                        path:imagePath, 
                        meta:null
                    }
                })
            }) 
        }       
    }
}
module.exports = controller;