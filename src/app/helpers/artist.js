const models = require('../../models');
exports.artist = async(user) => {
    data = await models.Artist.findOne({where:{user_id:user.id}})
    return data;
}