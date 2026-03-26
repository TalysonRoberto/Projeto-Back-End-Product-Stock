//====================================================
//            CONFIGURAÇÃO COM O BANCO
//====================================================
// Importa Sequelize para conexão com MySQL
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Carrega variáveis de ambiente

// Configura a conexão com o banco de dados
const connection = new Sequelize(
  process.env.DB_NAME, // Nome do banco
  process.env.DB_USER, // Usuário
  process.env.DB_PASS, // Senha
  {
    host: 'localhost', // Endereço do servidor
    dialect: 'mysql', // Tipo de banco
    port: 3300, // Porta do MySQL
    logging: false, // Desativa logs SQL no console
  },
);

module.exports = connection;
