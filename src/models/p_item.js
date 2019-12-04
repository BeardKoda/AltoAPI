'use strict';
module.exports = (sequelize, DataTypes) => {
  const P_Item = sequelize.define('P_Item', {
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
  P_Item.associate = function(models) {
    // // associations can be defined here
    P_Item.belongsTo(models.Playlist, {as: 'song', foreignKey:'song_id'})
  };
  return P_Item;
};