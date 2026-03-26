const express = require('express');
const ProductController = require('../controllers/ProductController');

const ProductRotas = express.Router();
const productController = new ProductController();

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Gerenciamento de produtos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProdutoResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         enabled:
 *           type: boolean
 *           example: true
 *         name:
 *           type: string
 *           example: "Produto 01"
 *         slug:
 *           type: string
 *           example: "produto-01"
 *         stock:
 *           type: integer
 *           example: 10
 *         description:
 *           type: string
 *           example: "Descrição do produto 01"
 *         price:
 *           type: number
 *           format: float
 *           example: 119.90
 *         price_with_discount:
 *           type: number
 *           format: float
 *           example: 99.90
 *         category_ids:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 15, 24, 68]
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               content:
 *                 type: string
 *                 example: "https://store.com/media/product-01/image-01.png"
 *         options:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               title:
 *                 type: string
 *               shape:
 *                 type: string
 *               radius:
 *                 type: integer
 *               type:
 *                 type: string
 *               values:
 *                 type: string
 *
 *     ProdutoCreate:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *         - price
 *         - price_with_discount
 *       properties:
 *         enabled:
 *           type: boolean
 *           default: false
 *           example: true
 *         name:
 *           type: string
 *           example: "Smartphone Pro Max"
 *         slug:
 *           type: string
 *           example: "smartphone-pro-max"
 *         stock:
 *           type: integer
 *           default: 0
 *           example: 15
 *         description:
 *           type: string
 *           example: "Smartphone com câmera de 108MP, 256GB de armazenamento e bateria de longa duração."
 *         price:
 *           type: number
 *           format: float
 *           example: 3499.90
 *         price_with_discount:
 *           type: number
 *           format: float
 *           example: 2999.90
 *         category_ids:
 *           type: array
 *           items:
 *             type: integer
 *           example: [5]
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: ['image/png', 'image/jpg', 'image/jpeg']
 *                 example: "image/png"
 *               content:
 *                 type: string
 *                 description: "Base64 da imagem"
 *                 example: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
 *         options:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Capacidade"
 *               shape:
 *                 type: string
 *                 enum: ['square', 'circle']
 *                 default: 'square'
 *                 example: "square"
 *               radius:
 *                 type: integer
 *                 default: 0
 *                 example: 8
 *               type:
 *                 type: string
 *                 enum: ['text', 'color']
 *                 default: 'text'
 *                 example: "text"
 *               values:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["128GB", "256GB", "512GB"]
 *
 *     ProdutoUpdate:
 *       type: object
 *       properties:
 *         enabled:
 *           type: boolean
 *           example: true
 *         name:
 *           type: string
 *           example: "Smartphone Pro Max Atualizado"
 *         slug:
 *           type: string
 *           example: "smartphone-pro-max-atualizado"
 *         stock:
 *           type: integer
 *           example: 20
 *         description:
 *           type: string
 *           example: "Smartphone com câmera de 200MP, 512GB de armazenamento"
 *         price:
 *           type: number
 *           example: 3999.90
 *         price_with_discount:
 *           type: number
 *           example: 3499.90
 *         category_ids:
 *           type: array
 *           items:
 *             type: integer
 *           example: [5, 6]
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: "ID da imagem existente (para atualizar ou deletar)"
 *                 example: 10
 *               deleted:
 *                 type: boolean
 *                 description: "Marca a imagem para exclusão"
 *                 example: true
 *               type:
 *                 type: string
 *                 enum: ['image/png', 'image/jpg', 'image/jpeg']
 *                 description: "Tipo da imagem (para novas imagens)"
 *                 example: "image/png"
 *               content:
 *                 type: string
 *                 description: "Base64 da imagem (para novas imagens)"
 *                 example: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
 *         options:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: "ID da opção existente (para atualizar ou deletar)"
 *                 example: 5
 *               deleted:
 *                 type: boolean
 *                 description: "Marca a opção para exclusão"
 *                 example: true
 *               title:
 *                 type: string
 *                 description: "Título da opção (para novas opções)"
 *                 example: "Cor"
 *               shape:
 *                 type: string
 *                 enum: ['square', 'circle']
 *                 description: "Formato da opção"
 *                 example: "circle"
 *               radius:
 *                 type: integer
 *                 description: "Raio do border-radius"
 *                 example: 10
 *               type:
 *                 type: string
 *                 enum: ['text', 'color']
 *                 description: "Tipo do input"
 *                 example: "color"
 *               values:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Valores da opção"
 *                 example: ["#000000", "#FFD700", "#808080"]
 *
 *     ProdutoListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProdutoResponse'
 *         total:
 *           type: integer
 *           example: 120
 *         limit:
 *           type: integer
 *           example: 12
 *         page:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /v1/product/search:
 *   get:
 *     summary: Lista produtos com filtros e paginação
 *     tags: [Produtos]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: "Número de itens por página (use -1 para todos os itens)"
 *         example: 30
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: "Número da página (ignorado quando limit = -1)"
 *         example: 2
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Campos específicos para retornar (separados por vírgula)"
 *         example: "name,images,price"
 *       - in: query
 *         name: match
 *         schema:
 *           type: string
 *         description: "Filtrar por termo no nome ou descrição"
 *         example: "Tênis"
 *       - in: query
 *         name: category_ids
 *         schema:
 *           type: string
 *         description: "Filtrar por IDs de categorias (separados por vírgula)"
 *         example: "15,24"
 *       - in: query
 *         name: price-range
 *         schema:
 *           type: string
 *         description: "Filtrar por faixa de preço (formato: min-max)"
 *         example: "100-200"
 *       - in: query
 *         name: option[45]
 *         schema:
 *           type: string
 *         description: "Filtrar por opções (ex: option[45]=GG,PP)"
 *         example: "GG,PP"
 *     responses:
 *       200:
 *         description: "Lista de produtos retornada com sucesso"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProdutoListResponse'
 *       400:
 *         description: "Parâmetros da requisição estão incorretos"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Parâmetros inválidos"
 */
ProductRotas.get(
  '/v1/product/search',
  productController.search.bind(productController),
);

/**
 * @swagger
 * /v1/product/{id}:
 *   get:
 *     summary: Busca produto pelo ID
 *     tags: [Produtos]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID do produto"
 *         example: 1
 *     responses:
 *       200:
 *         description: "Produto encontrado com sucesso"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProdutoResponse'
 *       404:
 *         description: "Produto não encontrado"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produto não encontrado"
 */
ProductRotas.get(
  '/v1/product/:id',
  productController.consultarPorId.bind(productController),
);

/**
 * @swagger
 * /v1/product:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoCreate'
 *     responses:
 *       201:
 *         description: "Produto criado com sucesso"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produto criado com sucesso"
 *                 product_id:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: "Dados da requisição estão incorretos"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
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
 */
ProductRotas.post(
  '/v1/product',
  productController.criar.bind(productController),
);

/**
 * @swagger
 * /v1/product/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID do produto"
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoUpdate'
 *     responses:
 *       204:
 *         description: "Produto atualizado com sucesso (sem conteúdo)"
 *       400:
 *         description: "Dados da requisição estão incorretos"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
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
 *         description: "Produto não encontrado"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produto não encontrado"
 */
ProductRotas.put(
  '/v1/product/:id',
  productController.atualizar.bind(productController),
);

/**
 * @swagger
 * /v1/product/{id}:
 *   delete:
 *     summary: Deleta um produto
 *     tags: [Produtos]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID do produto"
 *         example: 1
 *     responses:
 *       204:
 *         description: "Produto deletado com sucesso (sem conteúdo)"
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
 *         description: "Produto não encontrado"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produto não encontrado"
 */
ProductRotas.delete(
  '/v1/product/:id',
  productController.deletar.bind(productController),
);

module.exports = ProductRotas;
