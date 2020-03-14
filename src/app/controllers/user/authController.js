const { body, validationResult } = require('express-validator/check')
const moment = require('moment')
var jwt = require('jsonwebtoken');
var config = require('../../../config/jwt')
var bcrypt = require('bcryptjs');
var auth = require('../../middlewares/user/authMiddleware')
const uuidv1 = require('uuid/v1');
var models = require('../../../models');
var eventer=require('../../events/emitter')


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
    
    getToken: (user) =>{
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

    getData:(req, res,next)=>{
      // res.status(200).json(true);
      res.status(200).json({ message: true });
      return;
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
