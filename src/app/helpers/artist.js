const models = require('../../models');
exports.artist = async(user) => {
    data = await models.User.findOne({where:{id:user.id}})
    return data;
}