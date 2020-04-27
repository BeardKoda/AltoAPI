'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favourite = sequelize.define('Genre', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name:{
        allowNull:false,
        type:DataTypes.INTEGER
    },
    description:{
        allowNull:false,
        type:DataTypes.INTEGER
    },
    status:{
        allowNull:false,
        type:DataTypes.BOOLEAN
    }
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  Favourite.associate = function(models) {
    Favourite.belongsTo(models.Song, {as: 'song', foreignKey:'song_id'})
    Favourite.belongsTo(models.User, {as: 'album', foreignKey:'album_id'})
  };
  return Favourite;
};