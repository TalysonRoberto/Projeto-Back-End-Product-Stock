//====================================================
//                ROTAS CATEGORIA
//====================================================
const express = require('express');
const CategoriaRotas = express.Router();
const CategoriaController = require('../controllers/CategoriaController');

const categoriaController = new CategoriaController();

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Endpoints de categorias
 */

/**
 * @swagger
 * /v1/categoria/search:
 *   get:
 *     summary: Lista categorias
 *     tags: [Categorias]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *         description: Itens por página
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *         description: Página
 *       - in: query
 *         name: use_in_menu
 *         schema: { type: boolean }
 *         description: Filtrar por menu
 *     responses:
 *       200:
 *         description: Sucesso
 */
CategoriaRotas.get('/v1/categoria/search', categoriaController.search);

/**
 * @swagger
 * /v1/categoria/{id}:
 *   get:
 *     summary: Busca categoria por ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Sucesso
 *       404:
 *         description: Não encontrada
 */
CategoriaRotas.get('/v1/categoria/:id', categoriaController.consultarPorId);

/**
 * @swagger
 * /v1/categoria:
 *   post:
 *     summary: Cria categoria
 *     tags: [Categorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name: { type: string, example: "Eletrônicos" }
 *               slug: { type: string, example: "eletronicos" }
 *               use_in_menu: { type: boolean, example: true }
 *     responses:
 *       201:
 *         description: Criada
 *       400:
 *         description: Erro
 */
CategoriaRotas.post('/v1/categoria', categoriaController.criar);

/**
 * @swagger
 * /v1/categoria/{id}:
 *   put:
 *     summary: Atualiza categoria
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               slug: { type: string }
 *               use_in_menu: { type: boolean }
 *     responses:
 *       204:
 *         description: Atualizada
 *       404:
 *         description: Não encontrada
 */
CategoriaRotas.put('/v1/categoria/:id', categoriaController.atualizar);

/**
 * @swagger
 * /v1/categoria/{id}:
 *   delete:
 *     summary: Deleta categoria
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Deletada
 *       404:
 *         description: Não encontrada
 */
CategoriaRotas.delete('/v1/categoria/:id', categoriaController.deletar);

module.exports = CategoriaRotas;
