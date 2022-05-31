'use strict';
const {
  Model
} = require('sequelize');
const Users = require("./Users")
module.exports = (sequelize, DataTypes) => {
  class credentials extends Model {
    static associate(models) {
      credentials.belongsTo(models.users, { foreignKey: "useremail" });
      models.users.hasMany(credentials, { foreignKey: "useremail" })
    }
  }
  credentials.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    }, username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    useremail: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'credentials',
  });

  return credentials;
};


