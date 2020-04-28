'use strict';
module.exports = (sequelize, DataTypes) => {
  const Artist = sequelize.define('Artist', {
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
    user_id:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    email:{
      type: DataTypes.STRING,
      allowNull: false
    },
    status:{
      type: DataTypes.STRING,
      allowNull: false
    },
    premium:{
      type: DataTypes.STRING,
      allowNull: false
    },
    cover_img:{
      type: DataTypes.STRING,
      allowNull: true
    },
    email_token:{
      type: DataTypes.STRING,
      allowNull: true
    },
    email_verified_at:{
      type: DataTypes.DATE,
      allowNull: true
    },
    password:{
      type: DataTypes.STRING,
      allowNull: true
    },
    is_deleted:{
      type: DataTypes.INTEGER,
      default:false
    },
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  Artist.associate = function(models) {
    // // associations can be defined here
    // Artist.hasOne(models.User, {as: 'user', foreignKey:'id'})
    Artist.hasMany(models.Song, {as: 'songs', foreignKey:'artist_id'})
    Artist.hasMany(models.Album, {as: 'albums', foreignKey:'artist_id'})
  };
  return Artist;
};