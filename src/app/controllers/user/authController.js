const { body, validationResult } = require('express-validator/check')
var jwt = require('jsonwebtoken');
var config = require('../../../config/jwt')
var bcrypt = require('bcryptjs');
var auth = require('../../middlewares/user/authMiddleware')
const uuidv1 = require('uuid/v1');
var models = require('../../../models');

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
      var hashedPassword = bcrypt.hashSync(req.body.password, 8);
      models.User.findOne({where:{email:data.email}}).then(user => {
        if(!user){
          models.User.create({
            name : data.name, email : data.email, password : hashedPassword, status:"active", premium:0,
            uuid:uuidv1()
          }).then((user) => {
              var token =  controller.getToken(user)
              req.session.user = user
              res.status(200).json({ response: token });
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
  }
}
module.exports = controller
