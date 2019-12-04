const { body } = require('express-validator/check')

exports.validate = (method) => {
    switch (method) {
      case 'login': {
       return [ 
        body('email', 'Email is Invalid').exists().isEmail(),
        body('password', 'Password is Invalid').exists(),
         ]   
      }
      case 'register': {
       return [ 
          body('name', 'Username is Required').exists(),
          body('email', 'Email is Invalid').exists().isEmail(),
          body('password', 'Password is Invalid').exists(),
         ]   
      }
    }
  }