// Importa ferramentas e helpers
const request = require('supertest');
const app = require('../../../src/app');
const {
  createTestUser,
  createTestCategory,
  getAuthToken,
  clearTables,
} = require('../dbHelper');

// Testes de categorias
describe('Testes de Categorias', () => {
  let authToken;

  // Prepara ambiente antes de cada teste
  beforeEach(async () => {
    await clearTables(); // Limpa banco
    await createTestUser(); // Cria usuário
    authToken = await getAuthToken(request(app)); // Gera token
  });

  // Teste de criação
  describe('POST /v1/categoria', () => {
    it('Deve criar uma nova categoria com sucesso', async () => {
      const response = await request(app)
        .post('/v1/categoria')
        .set('token', authToken)
        .send({
          name: 'Eletrônicos',
          slug: 'eletronicos',
          use_in_menu: true,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        'message',
        'Categoria criada com sucesso',
      );
    });

    it('Deve retornar erro sem nome e slug', async () => {
      const response = await request(app)
        .post('/v1/categoria')
        .set('token', authToken)
        .send({ use_in_menu: true });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'name e slug são obrigatórios',
      );
    });
  });

  // Teste de listagem
  describe('GET /v1/categoria/search', () => {
    it('Deve listar categorias com sucesso', async () => {
      await createTestCategory();

      const response = await request(app)
        .get('/v1/categoria/search')
        .set('token', authToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  // Teste de busca por ID
  describe('GET /v1/categoria/:id', () => {
    it('Deve buscar categoria por ID com sucesso', async () => {
      const categoria = await createTestCategory();

      const response = await request(app)
        .get(`/v1/categoria/${categoria.id}`)
        .set('token', authToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', categoria.id);
    });

    it('Deve retornar 404 para categoria inexistente', async () => {
      const response = await request(app)
        .get('/v1/categoria/999')
        .set('token', authToken);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'Categoria não encontrada',
      );
    });
  });

  // Teste de atualização
  describe('PUT /v1/categoria/:id', () => {
    it('Deve atualizar categoria com sucesso', async () => {
      const categoria = await createTestCategory();

      const response = await request(app)
        .put(`/v1/categoria/${categoria.id}`)
        .set('token', authToken)
        .send({
          name: 'Eletrônicos Atualizado',
          slug: 'eletronicos-atualizado',
        });

      expect(response.status).toBe(204);
    });
  });

  // Teste de deleção
  describe('DELETE /v1/categoria/:id', () => {
    it('Deve deletar categoria com sucesso', async () => {
      const categoria = await createTestCategory();

      const response = await request(app)
        .delete(`/v1/categoria/${categoria.id}`)
        .set('token', authToken);

      expect(response.status).toBe(204);
    });
  });
});
