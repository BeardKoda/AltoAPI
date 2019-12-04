const { body, validationResult } = require('express-validator/check')
var jwt = require('jsonwebtoken');
var config = require('../../config/jwt')
var bcrypt = require('bcryptjs');
var auth = require('../middlewares/authrequest')

var models = require('../../models');

/* GET actorController. */
let controller = {
    login: (req, res) => {
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
              res.json({
                res:"user not found"
              }, 404)
            }
            if(user){
              var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
              if(!passwordIsValid) return res.status(401).json({
                res:"Unauthorized"
              })
              if(passwordIsValid){
                var token = controller.getToken(user)
                res.status(201).json({
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
    

    register:(req, res) => {
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
          }).then((user) => {
              var token =  controller.getToken(user)
              res.status(200).json({ auth: true, token });
            },
            (err) => {
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
      return token
    },
    
    getData:(req, res)=>{  
      var token = res.user;
      models.User.findOne({id:token.id}).then(
        user =>{
          res.status(200).json({user:user, val:token});
        }
      )
    }
}

module.exports = controller;