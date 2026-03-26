// Configuração global para os testes
const { sequelize } = require('../../src/config/connection');

beforeAll(async () => {
  // Apenas autentica, não recria o banco a cada teste
  await sequelize.authenticate();
  console.log('✅ Conexão com banco estabelecida para testes');
});

afterAll(async () => {
  // Fecha a conexão após os testes
  await sequelize.close();
  console.log('🔌 Conexão com banco fechada');
});

// Limpar dados entre os testes, mas não a estrutura
beforeEach(async () => {
  // Limpar todas as tabelas na ordem correta
  try {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    await sequelize.query('TRUNCATE TABLE product_category');
    await sequelize.query('TRUNCATE TABLE images_product');
    await sequelize.query('TRUNCATE TABLE product_options');
    await sequelize.query('TRUNCATE TABLE produtos');
    await sequelize.query('TRUNCATE TABLE categorias');
    await sequelize.query('TRUNCATE TABLE usuarios');

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Dados limpos para novo teste');
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error.message);
  }
});
