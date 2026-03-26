//====================================================
//                 MODEL USUÁRIO
//====================================================
const { DataTypes, Model } = require('sequelize');
const connection = require('../config/connection');

class UserModel extends Model {}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    firstname: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  },
  {
    tableName: 'usuarios', // passando o nome da tabela para não ser criado com o nome do model
    sequelize: connection,
  },
);

module.exports = UserModel;
