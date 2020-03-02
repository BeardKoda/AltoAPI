'use strict';
module.exports = (sequelize, DataTypes) => {
  const Playlist = sequelize.define('Playlist', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title:{
        allowNull:false,
        type:DataTypes.INTEGER
    },
    description:{
        allowNull:false,
        type:DataTypes.INTEGER
    },
    user_id:{
        allowNull:false,
        type:DataTypes.INTEGER
    },
    status:{
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
    tableName:'playlists'
  });
  Playlist.associate = function(models) {
    // associations can be defined here
    Playlist.hasMany(models.P_Item, {as: 'songs', foreignKey:'id', targetKey:'playlist_id'})
    Playlist.belongsTo(models.User, {as:'user', foreignKey:'user_id', targetKey:'id'})
  };
  return Playlist;
};