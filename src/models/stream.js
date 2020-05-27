'use strict';
module.exports = (sequelize, DataTypes) => {
  const Stream = sequelize.define('Stream', {
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
        allowNull:false,
        type:DataTypes.STRING
    },
    song_id:{
        allowNull:false,
        foreignKey:true,
        type:DataTypes.STRING,
    },
    ipaddress:{
        allowNull:false,
        type:DataTypes.BOOLEAN,
        default:true
    },
    is_deleted:{
        allowNull:false,
        type:DataTypes.STRING,
        allowNull:true
    }
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName:'streams'
  });
  Stream.associate = function(models) {
    // associations can be defined here
    // Stream.belongsTo(models.User, {as:'user', foreignKey:'user_id', targetKey:'id'})
    Stream.belongsTo(models.Song, {as:'Song'})
  };
  return Stream;
};