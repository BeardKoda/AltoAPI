const { body, validationResult } = require('express-validator/check')
const moment = require('moment')
var jwt = require('jsonwebtoken');
var config = require('../../../config/jwt')
var bcrypt = require('bcryptjs');
var auth = require('../../middlewares/user/authMiddleware')
const uuidv1 = require('uuid/v1');
var models = require('../../../models');
var eventer=require('../../events/emitter')
const general= require('../../helpers/general')


/* GET actorController. */
let controller = {
    login: (req, res, next) => {
      try {
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
        }
        data = req.body;
        models.User.findOne({where:{email:data.email}}).then(
          user => {
            if(!user){
              res.status(422).json({
                message:"user not found"
              })
            }
            if(user){
              var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
              if(!passwordIsValid) return res.status(401).json({
                message:"Wrong credientials"
              })
              if(passwordIsValid){
                req.session.user = user
                var token = controller.getToken(user)
                res.status(200).json({
                  response:token
                })
              }
            }
          },
          err => {
            res.status(500).json({
              error: err
            })
          }
        )
      }catch(err) {
        return next(err)
      }
    },

    register:(req, res, next) => {
      console.log(req.body)
      // res.send(req.body)
      try {
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
        }
      var data = req.body;
      var today = new Date();
      var token = Math.random().toString(36).substr(2, 5)
      var hashedPassword = bcrypt.hashSync(req.body.password, 8);
      models.User.findOne({where:{email:data.email}}).then(user => {
        if(!user){
          models.User.create({
            name : data.name, email : data.email, password : hashedPassword, status:"active", email_token:token, premium:0,
            uuid:uuidv1()
          }).then((user) => {
              var token =  controller.getToken(user)
              req.session.user = user
              eventer.emit('sendMail:Register', user)
              res.status(200).json({ response: token, messge:"Account created Successfully Verify Your Account" });
            },
            (err) => {
                console.log(err)
              return res.status(500).json("There was a problem registering the user.")
            }
          )
        }
        if(user){
          res.status(401).json({
            message:"Account already exits please login "
          })
        }
        },err => {
          res.status(500).json({
            message: err
          })
      })
      }catch(err) {
        return next(err)
      }
    },

    sendPasswordLink:(req,res,next)=>{
      // console.log(req.body)
      // res.send(req.body)
      try {
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
        }
        var token = Math.random().toString(36).substr(2, 30)
        // var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        models.User.findOne({where:{email:req.body.email}}).then(user => {
          if(!user){
            res.status(401).json({
              message:"Account dosen't exit "
            })
          }
          if(user){
            general.updateOrCreate(models.Password, {email:req.body.email},{ email:req.body.email,token}).then(async(resp)=>{
              let data = await models.Password.findOne({where:{email:req.body.email}})              
              // console.log(resp, data)
              eventer.emit('sendMail:Reset', data)
              res.status(200).json({
                message:'Password Reset sent. Check Your Email!'
              })
            })
          }
        },err => {
          res.status(500).json({
            message: err
          })
        })
      }catch(err){
        return next(err)
      }
    },

    verifyReset:(req, res,next)=>{
      console.log(req.params.token)
      try{
        models.Password.findOne({where:{token:req.params.token}}).then(async(pass) => {
          if(pass){
            res.status(200).json({
              message:"token valid"
            })
          }
          if(!pass){
            res.status(400).json({
              message:"token invalid"
            })
          }
        })
      }catch(err){
        return next(err)
      }
    },
    
    resetPassword:async(req,res,next)=>{
      console.log(req.body)
      let token = req.params.token
      // res.send(req.body)
      try {
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
        }
        
        models.Password.findOne({where:{token:token}}).then(async(pass) => {
          // console.log(pass)
          if(pass){
            models.User.findOne({where:{email:pass.email}}).then(
              async(user) => {
                if(!user){
                  res.status(422).json({
                    message:"user not found"
                  })
                }
                if(user){
                  var passwordIsValid = bcrypt.compareSync(req.body.oldpassword, user.password);
                  if(!passwordIsValid) return res.status(400).json({
                    message:"Password do not match"
                  })
                  if(passwordIsValid){
                    user.password = bcrypt.hashSync(req.body.newpassword, 8);
                    await user.save();
                    await models.Password.destroy({where:{token:token}})
                    res.status(200).json({
                      message:'Password Updated Successfully'
                    })
                  }
                }
              },
              err => {
                res.status(500).json({
                  error: err
                })
              }
            )
          }
        })
      }catch(err){
        return next(err)
      }
    },
    
    getToken:(user) =>{
      var token = jwt.sign({id:user.id}, config.jwt_secret, {
        expiresIn: 86400 // expires in 24 hours
      })
      var data = {
        "username" : user.name,
        "email":user.email,
        "is_artist":user.is_artist,
        "token":token,
        "token_type":"jwt",
        "expiresIn":86400
      }
      return data
    },
    
    refreshToken:(req, res)=>{  
      var token = res.user;
      models.User.findOne({where:{id:token.id}}).then(
        user =>{
      // console.log(res.user.id, user)
          data = controller.getToken(user)
          res.status(200).json({response:data});
        }
      )
    },

    updateProfile:async(req,res, next)=>{
      return null;
      const { full_name, stage_name, genre, dob, city, country, bio } = req.body
      const artist = await models.Artist.findOne({where:{user_id:res.user.id}});
      try{
          let avatar = req.files.cover;
          let name = artist.uuid+'/images/'+Date.now()+'_profile';
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

              data ={ full_name, stage_name, genre, dob, city, country, bio, avatar:name, artist_id:artist.id}
              updated = await general.updateOrCreate(models.Artist_Profile, {artist_id:artist.id},data)
                  res.status(200).json({
                      status:'finished',
                      message: 'Profile Updated',
                      data:null
                  })
              })
      }catch(err){
          res.status(500).json({data:"Internal Server Error"});
          throw new Error(err)
      } 
    },

    getData:async(req, res)=>{
      let _idd = res.user.id
      // console.log(res.user)
      // return res.status(200).json(res);
      
      user = await models.User.findOne({where:{id:_idd}})
      console.log(user)
      return res.status(200).json({ message: user });
    },

    logout:(req, res)=>{
      if(req.session.user){
        req.session.user =null
      // console.log('logout')
      return res.status(200).json({user:null, message:"logged out successfully"})
      }
      return res.status(202).json({user:null, message:"logged out successfully"})
    },

    ping:(req, res, next)=>{
      // console.log('ping')
      return res.status(200).json({user:null, message:"still active"})
    },

    resendVerification:(req,res)=>{
      let { email } = req.body;
      if(!email){
        res.status(422).json({message:'No email specified'})
      }
      models.User.findOne({where:{email:email}}).then(
        user => {
            res.status(200).json({
              message:"Account Verification Mail Sent"
            })
        },
        err => {
          res.status(500).json({
            error: err
          })
        }
      )
    },

    verifyAccount:(req,res)=>{
      let token = req.params.token
      // console.log(token)

      models.User.findOne({where:{email_token:token}}).then(
        user => {
          if(user!= null){
            var c_date = moment(user.createdAt).format('YYYY-MM-DD hh:mm:ss');
            var now = moment().format('YYYY-MM-DD hh:mm:ss')
            var status = moment(c_date).add(1, 'hours').format('YYYY-MM-DD hh:mm:ss');
            var isvalid = moment(now).isSameOrBefore(status)
            // console.log(c_date, status, moment().format('Y-MM-DD '), isvalid)
            if(isvalid){
              res.status(200).json({
                message:"Account Activated Successfully"
              })
            }else{
              res.status(422).json({
                error:"Activation code Expired"
              })
            }
          }else{
            res.status(422).json({
              error:"Invalid Activation code"
            })
          }
        },
        err => {
          res.status(500).json({
            error:err
          })
        }
      )
      // res.status(200).json(token);
    },

    sendmail:(req, res, next)=>{
      eventer.emit('sendMail:Register', {name:'Joshua', email:'akinsuyi.joshua84@gmail.com', email_token:'asfasgassgasgsagsag'})
      console.log('jhere')
    }
}
module.exports = controller