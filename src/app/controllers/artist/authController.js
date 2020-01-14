const { body, validationResult } = require('express-validator/check')
var jwt = require('jsonwebtoken');
var config = require('../../../config/jwt')
var bcrypt = require('bcryptjs');
var auth = require('../../middlewares/artist/authMiddleware')

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
        models.Artist.findOne({where:{email:data.email}}).then(
          user => {
            if(!user){
              res.status(404).json({
                res:"user not found"
              })
            }
            if(user){
              var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
              if(!passwordIsValid) return res.status(401).json({
                res:"Unauthorized"
              })
              if(passwordIsValid){
                req.session.artist = user
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
      models.Artist.findOne({where:{email:data.email}}).then(user => {
        if(!user){
          models.Artist.create({
            name : data.name, email : data.email, password : hashedPassword, status:"active", premium:0,is_deleted:false,
          }).then((user) => {
              var token =  controller.getToken(user)
              req.session.artist = user
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
            res:"user already exits please login "
          })
        }
        },err => {
          res.status(500).json({
            error: err
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
        "token":token,
        "token_type":"jwt",
        "expiresIn":86400
      }
      return data
    },
    
    getData:(req, res)=>{  
      var token = res.artist;
      models.Artist.findOne({id:token.id}).then(
        user =>{
          res.status(200).json({user:user, val:token});
        }
      )
    },

    logout:(req, res)=>{
      if(req.session.artist){
        req.session.artist =null
      // console.log('logout')
      return res.status(200).json({user:null, message:"logged out successfully"})
      }
      return res.status(202).json({user:null, message:"logged out successfully"})
    }
}

module.exports = controller