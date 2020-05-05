'use strict';
module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define('Song', {
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
    artist_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      default:" "
    },
    title:{
      type: DataTypes.STRING,
      allowNull: true,
      default:" "
    },
    description:{
      type: DataTypes.STRING,
      allowNull: true,
      default:" "
    },
    track_url:{
      type: DataTypes.STRING,
      allowNull: false,
      default:" "
    },
    cover_img:{
      type: DataTypes.STRING,
      allowNull: true,
      default:" "
    },
    release:{
      type: DataTypes.STRING,
      allowNull: true,
      default:" "
    },
    featuring:{
      type: DataTypes.STRING,
      allowNull: true,
      default:" "
    },
    producers:{
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
    status:{
      type: DataTypes.INTEGER,
      allowNull: true,
      default:" "
    },
    type:{
      type: DataTypes.STRING,
      allowNull: true,
      default:" "
    },
    year:{
      type: DataTypes.STRING,
      allowNull: true,
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
    duration:{
      type: DataTypes.STRING,
      allowNull: true,
      default:" "
    },
    level:{
      type: DataTypes.STRING,
      allowNull: true,
      default:" "
    },
    is_deleted:{
      type: DataTypes.INTEGER,
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
    Song.belongsTo(models.P_Item, {as: 'song', foreignKey: 'song_id', targetKey: 'id',})
    Song.belongsTo(models.Genre, {as: 'genres', foreignKey: 'genre', targetKey: 'id',})
  };
  return Song;
};