'use strict';
module.exports = (sequelize, DataTypes) => {
  const Play = sequelize.define('Stream', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id:{
        allowNull:false,
        type:DataTypes.INTEGER
    },
    song_id:{
        allowNull:false,
        type:DataTypes.INTEGER
    },
    ipaddress:{
        allowNull:false,
        type:DataTypes.BOOLEAN,
        default:true
    },
    is_deleted:{
        allowNull:false,
        type:DataTypes.BOOLEAN
    }
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName:'streams'
  });
  Play.associate = function(models) {
    // associations can be defined here
    Play.belongsTo(models.User, {as:'user', foreignKey:'user_id', targetKey:'id'})
    Play.belongsTo(models.Song, {as:'Song', foreignKey:'song_id', targetKey:'id'})
  };
  return Play;
};