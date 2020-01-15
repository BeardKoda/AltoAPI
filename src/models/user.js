'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    email:{
      type: DataTypes.STRING,
      allowNull: false
    },
    status:{
      type:DataTypes.STRING,
      allowNull:false
    },
    premium:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      define:0
    },
    email_token:{
      type:DataTypes.STRING,
      allowNull:true
    },
    email_verified_at:{
      type:DataTypes.STRING,
      allowNull:true
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false
    },
    cover_img:{
      type:DataTypes.STRING,
      allowNull:true
    },
    is_artist:{
      type:DataTypes.STRING,
      allowNull:true
    }   
  }, {
    tableName:'users',
    underscored: true,
    // createdAt: 'created_at',
    // updatedAt: 'updated_at',
  });
  User.associate = function(models) {
    // associations can be defined here
    User.belongsTo(models.Artist, {as: 'artist', foreignKey: 'id', targetKey: 'user_id',})
  };
  return User;
};