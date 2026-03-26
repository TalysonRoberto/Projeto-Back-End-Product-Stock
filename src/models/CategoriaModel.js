//====================================================
//                 MODEL CATEGORIA
//====================================================

// Importando os tipos do Sequelize e a conexão com o banco
const { DataTypes, Model } = require('sequelize');
const connection = require('../config/connection');

// Criando a classe do model que representa a tabela de categorias
class CategoriaModel extends Model {}

// Inicializando o model e definindo as colunas da tabela
CategoriaModel.init(
  {
    // ID da categoria (chave primária com auto incremento)
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Nome da categoria
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    // Slug da categoria
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    // Define se a categoria pode aparecer no menu
    // Por padrão começa como false
    use_in_menu: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    tableName: 'categorias', // Definindo explicitamente o nome da tabela no banco
    sequelize: connection, // Passando a conexão com o banco
    timestamps: false, // Desativando createdAt e updatedAt pois não estou utilizando
  },
);

module.exports = CategoriaModel;
