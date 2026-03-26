// Importa ferramentas e helpers
const request = require('supertest');
const app = require('../../../src/app');
const { createTestUser, getAuthToken, clearTables } = require('../dbHelper');

// Testes de usuários
describe('Testes de Usuários', () => {
  let authToken;

  // Executa uma vez antes de todos os testes
  beforeAll(async () => {
    await clearTables(); // Limpa banco
    await createTestUser(); // Cria usuário
    authToken = await getAuthToken(request(app)); // Gera token
  });

  // Executa uma vez depois de todos os testes
  afterAll(async () => {
    await clearTables(); // Limpa banco
  });

  // Testes de criação
  describe('POST /v1/users', () => {
    it('Deve criar um novo usuário com sucesso', async () => {
      const response = await request(app)
        .post('/v1/users')
        .set('token', authToken)
        .send({
          firstname: 'João',
          surname: 'Silva',
          email: 'joao.silva@teste.com',
          password: '123@123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        'message',
        'Usuario cadastrado com sucesso!',
      );
    });

    it('Deve criar usuário mesmo quando as senhas não coincidem (seu controller não valida)', async () => {
      const response = await request(app)
        .post('/v1/users')
        .set('token', authToken)
        .send({
          firstname: 'Maria',
          surname: 'Santos',
          email: 'maria.santos@teste.com',
          password: '123@123',
          confirmPassword: 'senhaerrada',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        'message',
        'Usuario cadastrado com sucesso!',
      );
    });

    it('Deve retornar erro quando faltam campos obrigatórios', async () => {
      const response = await request(app)
        .post('/v1/users')
        .set('token', authToken)
        .send({
          firstname: 'Pedro',
          email: 'pedro@teste.com',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve criar usuário mesmo sem o campo confirmPassword (seu controller não valida)', async () => {
      const response = await request(app)
        .post('/v1/users')
        .set('token', authToken)
        .send({
          firstname: 'Ana',
          surname: 'Souza',
          email: 'ana.souza@teste.com',
          password: '123@123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        'message',
        'Usuario cadastrado com sucesso!',
      );
    });
  });

  // Testes de listagem
  describe('GET /v1/users', () => {
    it('Deve listar todos os usuários sem o campo password', async () => {
      const response = await request(app)
        .get('/v1/users')
        .set('token', authToken);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      response.body.forEach((user) => {
        expect(user).not.toHaveProperty('password'); // Senha não aparece
      });
    });

    it('Deve listar apenas os campos solicitados via fields', async () => {
      const response = await request(app)
        .get('/v1/users?fields=id,firstname,email')
        .set('token', authToken);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      response.body.forEach((user) => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('firstname');
        expect(user).toHaveProperty('email');
      });
    });

    it('Deve retornar erro ao tentar listar com campo password', async () => {
      const response = await request(app)
        .get('/v1/users?fields=id,firstname,password')
        .set('token', authToken);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'O parametro solicitado não pode ser passado',
      );
    });
  });

  // Testes de busca por ID
  describe('GET /v1/users/:id', () => {
    it('Deve buscar usuário por ID com sucesso', async () => {
      // Cria usuário
      await request(app).post('/v1/users').set('token', authToken).send({
        firstname: 'Busca',
        surname: 'PorId',
        email: 'busca.porid@teste.com',
        password: '123@123',
      });

      // Busca ID do usuário criado
      const listResponse = await request(app)
        .get('/v1/users')
        .set('token', authToken);

      const createdUser = listResponse.body.find(
        (u) => u.email === 'busca.porid@teste.com',
      );
      const userId = createdUser.id;

      // Busca pelo ID
      const response = await request(app)
        .get(`/v1/users/${userId}`)
        .set('token', authToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('firstname', 'Busca');
      expect(response.body).toHaveProperty('surname', 'PorId');
      expect(response.body).not.toHaveProperty('password');
    });

    it('Deve retornar 404 para usuário inexistente', async () => {
      const response = await request(app)
        .get('/v1/users/99999')
        .set('token', authToken);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Usuário não encontrado');
    });
  });

  // Testes de atualização
  describe('PUT /v1/users/:id', () => {
    it('Deve atualizar usuário com sucesso', async () => {
      // Cria usuário
      await request(app).post('/v1/users').set('token', authToken).send({
        firstname: 'Para',
        surname: 'Atualizar',
        email: 'para.atualizar@teste.com',
        password: '123@123',
      });

      // Busca ID
      const listResponse = await request(app)
        .get('/v1/users')
        .set('token', authToken);

      const userToUpdate = listResponse.body.find(
        (u) => u.email === 'para.atualizar@teste.com',
      );
      const userId = userToUpdate.id;

      // Atualiza
      const response = await request(app)
        .put(`/v1/users/${userId}`)
        .set('token', authToken)
        .send({
          firstname: 'Atualizado',
          surname: 'Com Sucesso',
          email: 'atualizado@teste.com',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Usuário atualizado com sucesso',
      );

      // Verifica
      const getUserResponse = await request(app)
        .get(`/v1/users/${userId}`)
        .set('token', authToken);

      expect(getUserResponse.body.firstname).toBe('Atualizado');
      expect(getUserResponse.body.surname).toBe('Com Sucesso');
      expect(getUserResponse.body.email).toBe('atualizado@teste.com');
    });

    it('Deve atualizar apenas os campos enviados', async () => {
      // Cria usuário
      await request(app).post('/v1/users').set('token', authToken).send({
        firstname: 'Original',
        surname: 'Nome',
        email: 'original@teste.com',
        password: '123@123',
      });

      const listResponse = await request(app)
        .get('/v1/users')
        .set('token', authToken);

      const userToUpdate = listResponse.body.find(
        (u) => u.email === 'original@teste.com',
      );
      const userId = userToUpdate.id;

      // Atualiza apenas nome
      const response = await request(app)
        .put(`/v1/users/${userId}`)
        .set('token', authToken)
        .send({ firstname: 'ApenasNome' });

      expect(response.status).toBe(200);

      // Verifica que apenas nome mudou
      const getUserResponse = await request(app)
        .get(`/v1/users/${userId}`)
        .set('token', authToken);

      expect(getUserResponse.body.firstname).toBe('ApenasNome');
      expect(getUserResponse.body.surname).toBe('Nome');
      expect(getUserResponse.body.email).toBe('original@teste.com');
    });

    it('Deve atualizar senha com sucesso', async () => {
      // Cria usuário
      await request(app).post('/v1/users').set('token', authToken).send({
        firstname: 'Senha',
        surname: 'Antiga',
        email: 'senha.antiga@teste.com',
        password: '123@123',
      });

      const listResponse = await request(app)
        .get('/v1/users')
        .set('token', authToken);

      const userToUpdate = listResponse.body.find(
        (u) => u.email === 'senha.antiga@teste.com',
      );
      const userId = userToUpdate.id;

      // Atualiza senha
      const response = await request(app)
        .put(`/v1/users/${userId}`)
        .set('token', authToken)
        .send({ password: 'nova@senha123' });

      expect(response.status).toBe(200);

      // Testa login com nova senha
      const loginResponse = await request(app).post('/token').send({
        email: 'senha.antiga@teste.com',
        password: 'nova@senha123',
      });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty('token');
    });

    it('Deve retornar 404 ao atualizar usuário inexistente', async () => {
      const response = await request(app)
        .put('/v1/users/99999')
        .set('token', authToken)
        .send({ firstname: 'Inexistente' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Usuário não encontrado');
    });
  });

  // Testes de deleção
  describe('DELETE /v1/users/:id', () => {
    it('Deve deletar usuário com sucesso', async () => {
      // Cria usuário
      await request(app).post('/v1/users').set('token', authToken).send({
        firstname: 'Para',
        surname: 'Deletar',
        email: 'para.deletar@teste.com',
        password: '123@123',
      });

      const listResponse = await request(app)
        .get('/v1/users')
        .set('token', authToken);

      const userToDelete = listResponse.body.find(
        (u) => u.email === 'para.deletar@teste.com',
      );
      const userId = userToDelete.id;

      // Deleta
      const response = await request(app)
        .delete(`/v1/users/${userId}`)
        .set('token', authToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Usuário deletado com sucesso',
      );

      // Verifica que foi deletado
      const getUserResponse = await request(app)
        .get(`/v1/users/${userId}`)
        .set('token', authToken);

      expect(getUserResponse.status).toBe(404);
    });

    it('Deve retornar 404 ao deletar usuário inexistente', async () => {
      const response = await request(app)
        .delete('/v1/users/99999')
        .set('token', authToken);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Usuário não encontrado');
    });
  });
});
