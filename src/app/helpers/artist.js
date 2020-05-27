const models = require('../../models');
exports.artist = async(user) => {
    data = await models.Artist.findOne({where:{user_id:user.id}})
    return data;
}
exports.song = async(user) => {
    console.log(user)
    data = await models.Artist.findOne({where:{user_id:user}})
    return data;
}