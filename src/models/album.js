'use strict';
module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define('Album', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    artist_id:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title:{
      type: DataTypes.STRING,
      allowNull: false
    },
    description:{
      type: DataTypes.STRING,
      allowNull: false
    },
    cover_img:{
      type: DataTypes.STRING,
      allowNull: false
    },
    premium:{
      type: DataTypes.STRING,
      allowNull: false
    },
    year:{
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
    is_deleted:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  Album.associate = function(models) {
    // // associations can be defined here
    Album.hasMany(models.Song, {as: 'songs', foreignKey:'album_id', target:'album_id'}),
    Album.belongsTo (models.Artist, {as: 'artist', foreignKey:'artist_id', target:'artist_id'})
  };
  return Album;
};