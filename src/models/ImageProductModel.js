//====================================================
//               MODEL IMAGEM PRODUTO
//====================================================

// Importando os tipos do Sequelize e a conexão com o banco
const { DataTypes, Model } = require('sequelize');
const connection = require('../config/connection');
const ProductModel = require('./ProductModel'); // Importando parar referenciar o ID(chave estrangeira)

// Criando a classe do model que representa a tabela de imagem
class ImageProductModel extends Model {}

// Inicializando o model e definindo as colunas da tabela
ImageProductModel.init(
  {
    // ID da imagem  (chave primária com auto incremento)
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

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

    // Define se esta habitado ou nao
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },

    // Armazena o caminho relativo da imagem
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'images_product', // Definindo explicitamente o nome da tabela no banco
    sequelize: connection, // Passando a conexão com o banco
    timestamps: false,
  },
);

module.exports = ImageProductModel;
