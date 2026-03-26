// Importa o app configurado e a conexão com o banco
const app = require('./app');
const connection = require('./config/connection');
require('dotenv').config(); // Carrega variáveis de ambiente

const PORT = process.env.PORT || 3000; // Define a porta

// Gera um token de teste para facilitar os testes
const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: 1 }, process.env.APP_KEY_TOKEN);
console.log('-----------------------------------------');
console.log('🎫 SEU TOKEN DE TESTE (COPIE ISTO):');
console.log(token);
console.log('-----------------------------------------');

// Função que inicia o servidor
async function startServer() {
  try {
    // Testa conexão com o banco
    await connection.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida!');

    // Sincroniza os models com o banco (cria/atualiza tabelas)
    await connection.sync({ alter: true });

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao conectar no banco:', error);
  }
}

// Executa o servidor
startServer();
