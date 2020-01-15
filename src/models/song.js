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
      allowNull: true,
      default:" "
    },
    artist_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      default:" "
    },
    price:{
      type: DataTypes.STRING,
      allowNull: true,
      default:" "
    },
    genre:{
      type: DataTypes.STRING,
      allowNull: true,
      default:" "
    },
    year:{
      type: DataTypes.STRING,
      allowNull: true,
      default:" "
    },
    track_url:{
      type: DataTypes.STRING,
      allowNull: false,
      default:" "
    },
    privacy:{
      type: DataTypes.STRING,
      allowNull: true,
      default:" "
    },
    type:{
      type: DataTypes.STRING,
      allowNull: true,
      default:" "
    },
    status:{
      type: DataTypes.INTEGER,
      allowNull: true,
      default:" "
    },
    level:{
      type: DataTypes.STRING,
      allowNull: true,
      default:" "
    },
    album_id:{
      type: DataTypes.STRING,
      allowNull: true,
      foreignKey:true,
      default:" "
    },
    duration:{
      type: DataTypes.STRING,
      allowNull: true,
      default:" "
    },
    is_deleted:{
      type: DataTypes.INTEGER,
      allowNull: true,
      default:" "
    },
    cover_img:{
      type: DataTypes.STRING,
      allowNull: true,
      default:" "
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