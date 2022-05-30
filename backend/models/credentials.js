'use strict';
const {
  Model
} = require('sequelize');
const Users = require("./Users")
module.exports = (sequelize, DataTypes) => {
  class credentials extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      credentials.belongsTo(models.Users);
      models.Users.hasMany(credentials, { foreignKey: "useremail" })
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


