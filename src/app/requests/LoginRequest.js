const { body } = require('express-validator/check')

exports.validate = (method) => {
    switch (method) {
      case 'login': {
       return [ 
          body('email', 'Invalid email').exists().isEmail(),
          body('password', 'Invalid password').exists(),
         ]   
      }
    }
  }