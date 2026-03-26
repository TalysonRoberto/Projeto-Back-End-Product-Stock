// Importa ferramentas e helpers
const request = require('supertest');
const app = require('../../../src/app');
const {
  createTestUser,
  createTestCategory,
  getAuthToken,
  clearTables,
} = require('../dbHelper');

// Testes de produtos
describe('Testes de Produtos', () => {
  let authToken;
  let categoryId;

  // Prepara ambiente antes de cada teste
  beforeEach(async () => {
    await clearTables(); // Limpa banco
    await createTestUser(); // Cria usuário
    authToken = await getAuthToken(request(app)); // Gera token

    const category = await createTestCategory(); // Cria categoria
    categoryId = category.id; // Guarda ID da categoria
  });

  // Teste de criação
  describe('POST /v1/product', () => {
    it('Deve criar um novo produto com sucesso', async () => {
      const response = await request(app)
        .post('/v1/product')
        .set('token', authToken)
        .send({
          enabled: true,
          name: 'Smartphone Pro Max',
          slug: 'smartphone-pro-max',
          stock: 15,
          description: 'Smartphone com câmera de 108MP',
          price: 3499.9,
          price_with_discount: 2999.9,
          category_ids: [categoryId],
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        'message',
        'Produto criado com sucesso',
      );
      expect(response.body).toHaveProperty('product_id');
    });
  });

  // Teste de listagem
  describe('GET /v1/product/search', () => {
    it('Deve listar produtos com sucesso', async () => {
      // Cria produto primeiro
      await request(app)
        .post('/v1/product')
        .set('token', authToken)
        .send({
          enabled: true,
          name: 'Smartphone Pro Max',
          slug: 'smartphone-pro-max',
          stock: 15,
          description: 'Smartphone com câmera de 108MP',
          price: 3499.9,
          price_with_discount: 2999.9,
          category_ids: [categoryId],
        });

      const response = await request(app)
        .get('/v1/product/search')
        .set('token', authToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
    });
  });

  // Teste de busca por ID
  describe('GET /v1/product/:id', () => {
    it('Deve buscar produto por ID com sucesso', async () => {
      // Cria produto e guarda ID
      const createResponse = await request(app)
        .post('/v1/product')
        .set('token', authToken)
        .send({
          enabled: true,
          name: 'Smartphone Pro Max',
          slug: 'smartphone-pro-max',
          stock: 15,
          description: 'Smartphone com câmera de 108MP',
          price: 3499.9,
          price_with_discount: 2999.9,
          category_ids: [categoryId],
        });

      const productId = createResponse.body.product_id;

      // Busca pelo ID
      const response = await request(app)
        .get(`/v1/product/${productId}`)
        .set('token', authToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', productId);
    });
  });

  // Teste de deleção
  describe('DELETE /v1/product/:id', () => {
    it('Deve deletar produto com sucesso', async () => {
      // Cria produto e guarda ID
      const createResponse = await request(app)
        .post('/v1/product')
        .set('token', authToken)
        .send({
          enabled: true,
          name: 'Smartphone Pro Max',
          slug: 'smartphone-pro-max',
          stock: 15,
          description: 'Smartphone com câmera de 108MP',
          price: 3499.9,
          price_with_discount: 2999.9,
          category_ids: [categoryId],
        });

      const productId = createResponse.body.product_id;

      // Deleta produto
      const response = await request(app)
        .delete(`/v1/product/${productId}`)
        .set('token', authToken);

      expect(response.status).toBe(204);
    });
  });
});
