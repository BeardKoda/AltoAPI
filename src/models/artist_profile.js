'use strict';
module.exports = (sequelize, DataTypes) => {
  const Artist_Profile = sequelize.define('Artist_Profile', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    artist_id:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    full_name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    stage_name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    dob:{
      type: DataTypes.STRING,
      allowNull: false
    },
    bio:{
      type: DataTypes.TEXT,
      allowNull: false
    },
    genre:{
      type: DataTypes.STRING,
      allowNull: false
    },
    country:{
      type: DataTypes.STRING,
      allowNull: false
    },
    city:{
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar:{
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName:'artist__profiles'
  });
  Artist_Profile.associate = function(models) {
    Artist_Profile.belongsTo(models.Song, {as: 'profile', foreignKey:'artist_id'})
  };
  return Artist_Profile;
};