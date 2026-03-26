const express = require('express');
const RotasPrivadas = express.Router();

// Importa o middleware que acabamos de criar
const authMiddleware = require('../middleware/auth');

// Importa as rotas
const UserRotas = require('./UserRotas');
const CategoriaRotas = require('./CategoriaRotas');
const ProductRotas = require('./ProductRotas');

// Aplica o middleware de autenticação em TODAS as rotas abaixo
RotasPrivadas.use(authMiddleware);

// Todas as rotas abaixo agora são PRIVADAS
RotasPrivadas.use(UserRotas);
RotasPrivadas.use(CategoriaRotas);
RotasPrivadas.use(ProductRotas);

module.exports = RotasPrivadas;
