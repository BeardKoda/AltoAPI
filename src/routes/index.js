var user = require('express').Router()

user.post('/', (req,res,next)=>{
    res.send('hello post')
})
user.get('/', (req,res,next)=>{
    res.send('hello get')
})

module.exports = user