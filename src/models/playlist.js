'use strict';
module.exports = (sequelize, DataTypes) => {
  const Playlist = sequelize.define('Playlist', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    song_id:{
        allowNull:false,
        type:DataTypes.INTEGER
    },
    user_id:{
        allowNull:false,
        type:DataTypes.INTEGER
    },
    playlist_id:{
        allowNull:false,
        type:DataTypes.INTEGER
    },
    status:{
        allowNull:false,
        type:DataTypes.BOOLEAN
    },
    is_deleted:{
        allowNull:false,
        type:DataTypes.BOOLEAN
    }
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName:'playlist_items'
  });
  Playlist.associate = function(models) {
    // // associations can be defined here
    Playlist.belongsTo(models.Playlist, {as: 'song', foreignKey:'song_id'})
  };
  return Playlist;
};