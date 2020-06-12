const { body } = require('express-validator/check')

exports.validate = (method) => {
    switch (method) {
      case 'albumUpload': {
       return [ 
        body('title', 'Title is Required').exists(),
        body('description', 'Description is Required').exists(),
        body('premium', 'Premium is Required').exists(),
        body('year', 'Year is Required').exists(),
         ]   
      }
      case 'songUpload': {
        return [ 
            body('title', 'Title is Required').exists(),
            body('description', 'Description is Required').exists(),
            body('premium', 'Premium is Required').exists(),
            body('year', 'Year is Required').exists(),
          ]   
       }
    }
  }