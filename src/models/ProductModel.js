//====================================================
//                 MODEL PRODUTO
//====================================================

// Importando os tipos do Sequelize e a conexão com o banco
const { DataTypes, Model } = require('sequelize');
const connection = require('../config/connection');

// Criando a classe do model que representa a tabela de produtos
class ProductModel extends Model {}

// Inicializando o model e definindo as colunas da tabela
ProductModel.init(
  {
    // ID do produto (chave primária com auto incremento)
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Define se esta habitado ou nao
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    // Nome do produto
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },

    // slug do produto
    slug: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },

    // Define se a categoria aparece Por padrão começa como false
    use_in_menu: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    // Por padrão começa como false
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    // Descriçao do produto (preenchimento opcional)
    description: {
      type: DataTypes.STRING,
    },

    // Preco do produto
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    // Preco do produto com desconto
    price_with_discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: 'produtos', // Definindo explicitamente o nome da tabela no banco
    sequelize: connection, // Passando a conexão com o banco
    timestamps: true, // Ativado para gerar as colunas created_at e updated_at

    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

module.exports = ProductModel;
