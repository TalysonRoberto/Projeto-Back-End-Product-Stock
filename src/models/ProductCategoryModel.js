//====================================================
//               MODEL PRODUTO CATEGORIA
//====================================================

// Importando os tipos do Sequelize e a conexão com o banco
const { DataTypes, Model } = require('sequelize');
const connection = require('../config/connection');
const ProductModel = require('./ProductModel'); // Importando parar referenciar o ID(chave estrangeira)
const CategoriaModel = require('./CategoriaModel'); // Importando parar referenciar o ID(chave estrangeira)

// Criando a classe do model que representa a tabela de produto_categoria
class ProductCategory extends Model {}

// Inicializando o model e definindo as colunas da tabela
ProductCategory.init(
  {
    // chava estrangeira de produto
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        // Referenciando o produto
        model: ProductModel,
        key: 'id', // id chava estrangeira
      },
    },

    // chava estrangeira de categoria
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        // Referenciando a categoria
        model: CategoriaModel,
        key: 'id', // id chava estrangeira
      },
    },
  },
  {
    tableName: 'product_category', // Definindo explicitamente o nome da tabela no banco
    sequelize: connection, // Passando a conexão com o banco
    timestamps: false,
  },
);

module.exports = ProductCategory;
