//====================================================
//                 ROTAS USUÁRIO
//====================================================
const express = require('express');
const UserController = require('../controllers/UserController');
const UsuarioRotas = express.Router();

const userController = new UserController();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * /v1/users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Campos específicos (separados por vírgula). Não é permitido usar 'password'"
 *         example: "id,firstname,surname,email"
 *     responses:
 *       200:
 *         description: "Lista de usuários"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: "Campo password não permitido"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "O parametro solicitado não pode ser passado"
 *                 motivo:
 *                   type: string
 *                   example: "A solicitação esta fora do requisito de segurança"
 */
UsuarioRotas.get('/v1/users', userController.listar);

/**
 * @swagger
 * /v1/users/{id}:
 *   get:
 *     summary: Busca usuário por ID
 *     tags: [Usuários]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID do usuário"
 *         example: 4
 *     responses:
 *       200:
 *         description: "Dados do usuário"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: "Usuário não encontrado"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado"
 */
UsuarioRotas.get('/v1/users/:id', userController.consultarPorId);

/**
 * @swagger
 * components:
 *   schemas:
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 4
 *         firstname:
 *           type: string
 *           example: "talyson"
 *         surname:
 *           type: string
 *           example: "talyson"
 *         email:
 *           type: string
 *           format: email
 *           example: "talyson@gmail.com"
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     UserCreate:
 *       type: object
 *       required:
 *         - firstname
 *         - surname
 *         - email
 *         - password
 *       properties:
 *         firstname:
 *           type: string
 *           description: "Nome do usuário"
 *           example: "talyson"
 *         surname:
 *           type: string
 *           description: "Sobrenome do usuário"
 *           example: "talyson"
 *         email:
 *           type: string
 *           format: email
 *           description: "E-mail do usuário"
 *           example: "talyson@gmail.com"
 *         password:
 *           type: string
 *           format: password
 *           description: "Senha (será criptografada)"
 *           example: "123456"
 *
 *     UserUpdate:
 *       type: object
 *       properties:
 *         firstname:
 *           type: string
 *           description: "Nome do usuário"
 *           example: "talyson atualizado"
 *         surname:
 *           type: string
 *           description: "Sobrenome do usuário"
 *           example: "talyson atualizado"
 *         email:
 *           type: string
 *           format: email
 *           description: "E-mail do usuário"
 *           example: "talyson.atualizado@gmail.com"
 *         password:
 *           type: string
 *           format: password
 *           description: "Nova senha (será criptografada)"
 *           example: "nova_senha123"
 */

/**
 * @swagger
 * /v1/users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *           example:
 *             firstname: "talyson"
 *             surname: "talyson"
 *             email: "talyson@gmail.com"
 *             password: "123456"
 *     responses:
 *       201:
 *         description: "Usuário criado com sucesso"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario cadastrado com sucesso!"
 *       400:
 *         description: "Dados da requisição estão incorretos"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation error"
 *       401:
 *         description: "Token de autorização não enviado ou inválido"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Não Autorizado"
 */
UsuarioRotas.post('/v1/users', userController.criar);

/**
 * @swagger
 * /v1/users/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Usuários]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID do usuário"
 *         example: 4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *           example:
 *             firstname: "talyson atualizado"
 *             surname: "talyson atualizado"
 *             email: "talyson.atualizado@gmail.com"
 *             password: "nova_senha123"
 *     responses:
 *       200:
 *         description: "Usuário atualizado com sucesso"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário atualizado com sucesso"
 *       400:
 *         description: "Dados da requisição estão incorretos"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: "Token de autorização não enviado ou inválido"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Não Autorizado"
 *       404:
 *         description: "Usuário não encontrado"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado"
 */
UsuarioRotas.put('/v1/users/:id', userController.atualizar);

/**
 * @swagger
 * /v1/users/{id}:
 *   delete:
 *     summary: Deleta um usuário
 *     tags: [Usuários]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID do usuário"
 *         example: 4
 *     responses:
 *       200:
 *         description: "Usuário deletado com sucesso"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário deletado com sucesso"
 *       401:
 *         description: "Token de autorização não enviado ou inválido"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Não Autorizado"
 *       404:
 *         description: "Usuário não encontrado"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado"
 *       500:
 *         description: "Erro interno"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
UsuarioRotas.delete('/v1/users/:id', userController.deletar);

module.exports = UsuarioRotas;
