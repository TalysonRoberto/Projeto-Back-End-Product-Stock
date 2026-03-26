const { sequelize } = require('../../src/config/connection');
const UserModel = require('../../src/models/UserModel');
const CategoriaModel = require('../../src/models/CategoriaModel');
const ProductModel = require('../../src/models/ProductModel');
const ImageProductModel = require('../../src/models/ImageProductModel');
const OptionProductModel = require('../../src/models/OptionProductModel');
const ProductCategoryModel = require('../../src/models/ProductCategoryModel');
const MD5 = require('crypto-js/md5');

// Helper para limpar tabelas (deletando na ordem correta)
const clearTables = async () => {
  try {
    // 1. Primeiro, deletar os registros das tabelas de relacionamento (que têm chaves estrangeiras)
    await ProductCategoryModel.destroy({
      where: {},
      truncate: false,
      cascade: true,
    });
    await ImageProductModel.destroy({
      where: {},
      truncate: false,
      cascade: true,
    });
    await OptionProductModel.destroy({
      where: {},
      truncate: false,
      cascade: true,
    });

    // 2. Depois, deletar os registros das tabelas principais
    await ProductModel.destroy({ where: {}, truncate: false, cascade: true });
    await CategoriaModel.destroy({ where: {}, truncate: false, cascade: true });
    await UserModel.destroy({ where: {}, truncate: false, cascade: true });

    console.log('✅ Tabelas limpas com sucesso');
  } catch (error) {
    console.error('❌ Erro ao limpar tabelas:', error.message);
    // Se ainda der erro, tenta deletar com raw query
    try {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      await ProductCategoryModel.destroy({ where: {}, truncate: true });
      await ImageProductModel.destroy({ where: {}, truncate: true });
      await OptionProductModel.destroy({ where: {}, truncate: true });
      await ProductModel.destroy({ where: {}, truncate: true });
      await CategoriaModel.destroy({ where: {}, truncate: true });
      await UserModel.destroy({ where: {}, truncate: true });
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('✅ Tabelas limpas com sucesso (via raw query)');
    } catch (err) {
      console.error('❌ Erro ao limpar tabelas via raw query:', err.message);
    }
  }
};

// Helper para criar usuário de teste
const createTestUser = async () => {
  const [user, created] = await UserModel.findOrCreate({
    where: { email: 'teste@teste.com' },
    defaults: {
      firstname: 'Teste',
      surname: 'Usuário',
      email: 'teste@teste.com',
      password: MD5('123456').toString(),
    },
  });
  return user;
};

// Helper para criar categoria de teste
const createTestCategory = async () => {
  const [category, created] = await CategoriaModel.findOrCreate({
    where: { slug: 'categoria-teste' },
    defaults: {
      name: 'Categoria Teste',
      slug: 'categoria-teste',
      use_in_menu: true,
    },
  });
  return category;
};

// Helper para criar produto de teste
const createTestProduct = async (categoryIds = []) => {
  const product = await ProductModel.create({
    enabled: true,
    name: 'Produto Teste',
    slug: 'produto-teste',
    stock: 10,
    description: 'Descrição do produto teste',
    price: 100.0,
    price_with_discount: 80.0,
    use_in_menu: true,
  });

  if (categoryIds.length > 0) {
    for (const categoryId of categoryIds) {
      await ProductCategoryModel.findOrCreate({
        where: {
          product_id: product.id,
          category_id: categoryId,
        },
        defaults: {
          product_id: product.id,
          category_id: categoryId,
        },
      });
    }
  }

  return product;
};

// Helper para gerar token de autenticação
const getAuthToken = async (requestApp) => {
  const response = await requestApp
    .post('/token')
    .send({ email: 'teste@teste.com', password: '123456' });

  return response.body.token;
};

module.exports = {
  clearTables,
  createTestUser,
  createTestCategory,
  createTestProduct,
  getAuthToken,
  sequelize,
};
