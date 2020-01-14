'use strict';
module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define('Song', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title:{
      type: DataTypes.STRING,
      allowNull: false
    },
    artist_id:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price:{
      type: DataTypes.STRING,
      allowNull: false
    },
    genre:{
      type: DataTypes.STRING,
      allowNull: false
    },
    year:{
      type: DataTypes.STRING,
      allowNull: false
    },
    track_url:{
      type: DataTypes.STRING,
      allowNull: false
    },
    privacy:{
      type: DataTypes.STRING,
      allowNull: false
    },
    type:{
      type: DataTypes.STRING,
      allowNull: false
    },
    status:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    level:{
      type: DataTypes.STRING,
      allowNull: true
    },
    album_id:{
      type: DataTypes.STRING,
      allowNull: false,
      foreignKey:true
    },
    duration:{
      type: DataTypes.STRING,
      allowNull: false
    },
    is_deleted:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cover_img:{
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName:'songs'
  });
  Song.associate = function(models) {
    // associations can be defined here
    Song.belongsTo(models.Album, {as: 'album', foreignKey: 'album_id', targetKey: 'id',})
    Song.belongsTo(models.Artist, {as: 'artist', foreignKey: 'artist_id', targetKey: 'id',})
  };
  return Song;
};