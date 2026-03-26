// Importa ferramentas para testar requisições HTTP
const request = require('supertest');
// Importa o app do Express
const app = require('../../../src/app');
// Importa funções auxiliares para criar usuário e limpar banco
const { createTestUser, clearTables } = require('../dbHelper');
// Biblioteca para criptografia MD5
const MD5 = require('crypto-js/md5');

// Agrupa testes de autenticação
describe('Testes de Autenticação', () => {
  // Antes de cada teste, limpa o banco de dados
  beforeEach(async () => {
    await clearTables();
  });

  // Testes do endpoint de login
  describe('POST /token', () => {
    // Teste de login bem-sucedido
    it('Deve realizar login com sucesso', async () => {
      // Cria um usuário no banco
      await createTestUser();

      // Faz requisição de login
      const response = await request(app).post('/token').send({
        email: 'teste@teste.com',
        password: '123456',
      });

      // Verifica se retornou status 200 e os dados esperados
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty(
        'message',
        'Login realizado com sucesso',
      );
    });

    // Teste de senha incorreta
    it('Deve retornar erro com senha incorreta', async () => {
      // Cria usuário
      await createTestUser();

      // Tenta login com senha errada
      const response = await request(app).post('/token').send({
        email: 'teste@teste.com',
        password: 'senhaerrada',
      });

      // Verifica se retornou erro 400
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'Email ou senha inválidos',
      );
    });
  });
});
