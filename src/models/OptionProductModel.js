//====================================================
//               MODEL OPTION PRODUTO
//====================================================

// Importando os tipos do Sequelize e a conexão com o banco
const { DataTypes, Model } = require('sequelize');
const connection = require('../config/connection');
const ProductModel = require('./ProductModel');

// Criando a classe do model que representa a tabela de opções do produto
class OptionProdutoModel extends Model {}

// Inicializando o model e definindo as colunas da tabela
OptionProdutoModel.init(
  {
    // ID da opção (chave primária com auto incremento)
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Chave estrangeira para produto
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductModel,
        key: 'id',
      },
    },

    // Título da opção
    title: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },

    // Formato da opção (square ou circle)
    shape: {
      type: DataTypes.ENUM('square', 'circle'),
      allowNull: true,
      defaultValue: 'square',
    },

    // Valor do border-radius
    radius: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    // Tipo do input (text ou color)
    type: {
      type: DataTypes.ENUM('text', 'color'),
      allowNull: true,
      defaultValue: 'text',
    },

    // Valores das opções separados por vírgula
    values: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'product_options',
    sequelize: connection,
    timestamps: false,
  },
);

module.exports = OptionProdutoModel;
