//====================================================
//               CONTROLLER CATEGORIA
//====================================================

// Importando o model da categoria para fazer as operações no banco
const CategoriaModel = require('../models/CategoriaModel');

class CategoryController {
  // ============================== SEARCH =================================
  // Método responsável por buscar categorias com filtros e paginação
  async search(request, response) {
    try {
      // Pegando os parâmetros da query string
      // Defini um padrão de 12 itens por página e página 1
      let { limit = 12, page = 1, fields, use_in_menu } = request.query;

      // Convertendo para número pois query sempre chega como string
      limit = Number(limit);
      page = Number(page);

      // Caso os valores não sejam numéricos, retorno erro
      if (isNaN(limit) || isNaN(page)) {
        return response.status(400).json({
          message: 'Parâmetros inválidos',
        });
      }

      // Objeto onde serão adicionados os filtros de busca
      const where = {};

      // Se for passado o filtro use_in_menu na query
      if (use_in_menu !== undefined) {
        // Converto para boolean
        where.use_in_menu = use_in_menu === 'true';
      }

      // Caso seja informado fields na query, separo por vírgula
      // para limitar os campos retornados
      const attributes = fields ? fields.split(',') : undefined;

      // Montando as opções de consulta para o sequelize
      let options = {
        where,
        attributes,
      };

      // Se o limit for diferente de -1 aplico paginação
      if (limit !== -1) {
        options.limit = limit;
        options.offset = (page - 1) * limit;
      }

      // Utilizo findAndCountAll para retornar os dados e o total de registros
      const { count, rows } = await CategoriaModel.findAndCountAll(options);

      // Retorno no formato exigido pela API
      return response.json({
        data: rows,
        total: count,
        limit,
        page,
      });
    } catch (error) {
      return response.status(400).json({
        error: error.message,
      });
    }
  }

  // ====================== CONSULTAR POR ID ==============================
  // Método para buscar uma categoria específica pelo ID
  async consultarPorId(request, response) {
    try {
      // Pegando o id da rota
      const { id } = request.params;

      // Buscando no banco pela chave primária
      const category = await CategoriaModel.findByPk(id);

      // Caso não exista retorno 404
      if (!category) {
        return response.status(404).json({
          message: 'Categoria não encontrada',
        });
      }

      // Caso encontre retorno os dados da categoria
      return response.json(category);
    } catch (error) {
      return response.status(400).json({
        error: error.message,
      });
    }
  }

  // ============================== CRIAR =================================
  // Método responsável por cadastrar uma nova categoria
  async criar(request, response) {
    try {
      // Pegando os dados enviados no body
      const { name, slug, use_in_menu } = request.body;

      // Validação básica para garantir que os campos obrigatórios foram enviados
      if (!name || !slug) {
        return response.status(400).json({
          message: 'name e slug são obrigatórios',
        });
      }

      // Criando o registro no banco
      await CategoriaModel.create({
        name,
        slug,
        use_in_menu,
      });

      // Retornando status 201 conforme especificação
      return response.status(201).json({
        message: 'Categoria criada com sucesso',
      });
    } catch (error) {
      return response.status(400).json({
        error: error.message,
      });
    }
  }

  // ============================== ATUALIZAR =============================
  // Método responsável por atualizar uma categoria existente
  async atualizar(request, response) {
    try {
      // Pegando o id da rota
      const { id } = request.params;

      // Pegando os dados enviados para atualização
      const body = request.body;

      // Definindo quais campos são permitidos para atualização
      const allowedFields = ['name', 'slug', 'use_in_menu'];

      // Pegando as chaves enviadas no body
      const bodyKeys = Object.keys(body);

      // Verificando se foi enviado algum campo inválido
      const invalidFields = bodyKeys.filter(
        (field) => !allowedFields.includes(field),
      );

      // Se houver campos inválidos retorno erro 400
      if (invalidFields.length > 0) {
        return response.status(400).json({
          message: 'Campos inválidos enviados',
          campos_invalidos: invalidFields,
        });
      }

      // Verificando se a categoria existe
      const category = await CategoriaModel.findByPk(id);

      if (!category) {
        return response.status(404).json({
          message: 'Categoria não encontrada',
        });
      }

      // Atualizando os dados no banco
      await CategoriaModel.update(body, {
        where: { id },
      });

      // Conforme especificação retorno 204 sem corpo
      return response.status(204).send();
    } catch (error) {
      return response.status(400).json({
        error: error.message,
      });
    }
  }

  // ============================== DELETAR ================================
  // Método responsável por remover uma categoria
  async deletar(request, response) {
    try {
      // Pegando o id da rota
      const { id } = request.params;

      // Verificando se a categoria existe antes de deletar
      const category = await CategoriaModel.findByPk(id);

      if (!category) {
        return response.status(404).json({
          message: 'Categoria não encontrada',
        });
      }

      // Removendo o registro do banco
      await CategoriaModel.destroy({
        where: { id },
      });

      // Retorno 204 sem corpo conforme padrão REST
      return response.status(204).send();
    } catch (error) {
      return response.status(400).json({
        error: error.message,
      });
    }
  }
}

// Exportando o controller para ser usado nas rotas
module.exports = CategoryController;
