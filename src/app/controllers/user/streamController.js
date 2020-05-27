const { body, validationResult } = require('express-validator/check')
var models = require('../../../models');
const { Op } = require("sequelize");
const axios =require('axios')
var Art = require('../../helpers/artist')

const { S3_URL } = require('../../../config/app')
let limit = 20;   // number of records per page
let offset = 0;
const uuidv1 = require('uuid/v1');

const getIPlocation=async(ip)=>{
    let res = await axios.get(`http://ip-api.com/json/${ip}`)
    return res.data;
}
/* GET actorController. */
let controller = {
    addStream:async(req,res)=>{
        let uid = req.params.id
        let userId = res.user.id
        let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        let ipdata = await getIPlocation(ip)
        if(uid!=null){
            models.Song.findOne({where:{uuid:uid}, attributes:['id', 'artist_id']})
            .then(async song =>{
                var me = await Art.song(song.artist_id)
                // console.log(userId, me.user_id)
                if(userId==me.user_id){
                    // console.log(me, userId);
                    res.status(200).json({done:false});
                }
                if(song){ 
                    models.Stream.create({ user_id: userId, song_id:song.id, ipaddress:ip, data:JSON.stringify(ipdata), uuid:uuidv1()})
                    .then(data =>{
                        res.status(200).json({data:true});
                    })
                }
                else res.status(422).json({data:false});
            }).catch(err=>{
                console.log(err)
                res.status(400).json({data:false})
            })
        }else{
            res.send('no song is played')
        }
    },
}

module.exports = controller;