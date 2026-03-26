const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const AuthController = require('../controllers/AuthController');

const RotasPublicas = express.Router();

// Rota inicial
RotasPublicas.get('/', async (request, response) => {
  return response.status(200).send('Bem vindo');
});

/**
 * @swagger
 * /token:
 *   post:
 *     summary: Gera um token de acesso (Login)
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: "admin@admin.com" }
 *               password: { type: string, format: password, example: "123456" }
 *     responses:
 *       200: { description: Login realizado com sucesso }
 *       400: { description: Email ou senha inválidos }
 *       500: { description: Erro interno no servidor }
 */
RotasPublicas.post('/token', async (request, response) => {
  try {
    console.log('BODY RECEBIDO:', request.body);
    const body = request.body;
    const auth = new AuthController();
    const dados = await auth.login(body.email, body.password);
    console.log('RESULTADO DO LOGIN:', dados);

    if (dados) {
      // Dados para gerar o token
      const dataToken = {
        id: dados.id,
        email: dados.email,
        username: dados.username,
      };

      // Gera token JWT
      const token = jwt.sign(dataToken, process.env.APP_KEY_TOKEN, {
        expiresIn: process.env.APP_TEMP,
      });

      return response.json({
        message: 'Login realizado com sucesso',
        data: dados,
        token: token,
      });
    }

    // Credenciais inválidas
    return response.status(400).json({
      message: 'Email ou senha inválidos',
    });
  } catch (error) {
    return response.status(500).json({
      message: 'Erro interno no servidor',
      error: error.message,
    });
  }
});

module.exports = RotasPublicas;
