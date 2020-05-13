'use strict';
module.exports = (sequelize, DataTypes) => {
  const Password = sequelize.define('Password', {
    email:{
        allowNull:false,
        type:DataTypes.STRING,
        primaryKey: true
    },
    token:{
        allowNull:false,
        type:DataTypes.STRING
    }
  }, {
    underscored: true,
    timestamps: true,
    updatedAt:false,
    createdAt: 'created_at',
    tableName:'password_resets'
  });
  Password.associate = function(models) {
    // associations can be defined here
  };
  return Password;
};