'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favourite = sequelize.define('Favourite', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    uuid:{
      type:DataTypes.STRING,
      allowNull:false
    },
    song_id:{
        allowNull:false,
        type:DataTypes.INTEGER
    },
    user_id:{
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
    // // associations can be defined here
    Favourite.belongsTo(models.Song, {as: 'song', foreignKey:'song_id', targetKey:'id'})
    Favourite.belongsTo(models.User, {as: 'user', foreignKey:'user_id'})
  };
  return Favourite;
};