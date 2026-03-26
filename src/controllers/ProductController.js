//====================================================
//               CONTROLLER PRODUTO
//====================================================
// Importando os models necessários - Ajustado conforme os nomes reais dos arquivos
const ProductModel = require('../models/ProductModel');
const CategoriaModel = require('../models/CategoriaModel');
const ImageProductModel = require('../models/ImageProductModel');
const OptionProductModel = require('../models/OptionProductModel');
const ProductCategoryModel = require('../models/ProductCategoryModel'); // Nome corrigido

// Importando operadores do Sequelize
const { Op } = require('sequelize');

// ========== CONFIGURAR ASSOCIAÇÕES ==========
if (!ProductModel.associations || !ProductModel.associations.categorias) {
  // Produto <-> Categoria (Muitos para Muitos)
  // CORREÇÃO: No 'through' você deve passar a variável ProductCategoryModel que importou acima
  ProductModel.belongsToMany(CategoriaModel, {
    through: ProductCategoryModel,
    foreignKey: 'product_id',
    otherKey: 'category_id',
    as: 'categorias',
  });

  CategoriaModel.belongsToMany(ProductModel, {
    through: ProductCategoryModel,
    foreignKey: 'category_id',
    otherKey: 'product_id',
    as: 'produtos',
  });

  // Produto <-> Imagem (Um para Muitos)
  ProductModel.hasMany(ImageProductModel, {
    foreignKey: 'product_id',
    as: 'images',
  });

  ImageProductModel.belongsTo(ProductModel, {
    foreignKey: 'product_id',
    as: 'produto',
  });

  // Produto <-> Opção (Um para Muitos)
  ProductModel.hasMany(OptionProductModel, {
    foreignKey: 'product_id',
    as: 'options',
  });

  OptionProductModel.belongsTo(ProductModel, {
    foreignKey: 'product_id',
    as: 'produto',
  });
}
class ProductController {
  // ============================== SEARCH =================================
  async search(request, response) {
    try {
      // Pegando os parâmetros da query string
      let {
        limit = 12,
        page = 1,
        fields,
        match,
        category_ids,
        'price-range': priceRange,
        ...optionFilters
      } = request.query;

      // Convertendo para número
      limit = Number(limit);
      page = Number(page);

      // Validação de parâmetros numéricos
      if (isNaN(limit) || isNaN(page)) {
        return response.status(400).json({
          message: 'Parâmetros inválidos',
        });
      }

      // Importando operadores do Sequelize
      const { Op } = require('sequelize');

      // Objeto onde serão adicionados os filtros de busca
      const where = {};

      // Filtro por match (busca no nome ou descrição)
      if (match) {
        where[Op.or] = [
          {
            name: {
              [Op.like]: `%${match}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${match}%`,
            },
          },
        ];
      }

      // Filtro por price-range (ex: 100-200)
      if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split('-').map(Number);

        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
          where.price = {
            [Op.between]: [minPrice, maxPrice],
          };
        } else if (!isNaN(minPrice)) {
          // Se só tiver um valor, considerar como preço mínimo
          where.price = {
            [Op.gte]: minPrice,
          };
        }
      }

      // Configuração de includes
      const include = [];

      // Incluir categorias se necessário para filtro
      if (category_ids) {
        const ids = category_ids.split(',').map(Number);
        include.push({
          model: CategoriaModel,
          as: 'categorias',
          where: {
            id: {
              [Op.in]: ids,
            },
          },
          through: { attributes: [] },
          attributes: [],
        });
      }

      // Incluir opções se houver filtros por opções
      const optionWhereConditions = [];

      // Processar filtros de opções (ex: option[45]=GG,PP)
      for (const [key, value] of Object.entries(optionFilters)) {
        // Verificar se a chave começa com "option[" e termina com "]"
        const matchOption = key.match(/^option\[(\d+)\]$/);
        if (matchOption) {
          const optionId = parseInt(matchOption[1]);
          const optionValues = value.split(',');

          optionWhereConditions.push({
            id: optionId,
            values: {
              [Op.or]: optionValues.map((val) => ({
                [Op.like]: `%${val}%`,
              })),
            },
          });
        }
      }

      // Se houver filtros de opções, adicionar include com condições
      if (optionWhereConditions.length > 0) {
        include.push({
          model: OptionProductModel,
          as: 'options', // <--- ADICIONE ESTA LINHA
          where: {
            [Op.or]: optionWhereConditions,
          },
          attributes: [],
        });
      } else {
        // Incluir opções apenas para retornar nos dados
        include.push({
          model: OptionProductModel,
          as: 'options', // <--- ADICIONE ESTA LINHA TAMBÉM
          required: false,
          attributes: ['id', 'title', 'shape', 'radius', 'type', 'values'],
        });
      }

      // Incluir imagens
      include.push({
        model: ImageProductModel,
        as: 'images',
        required: false,
        where: { enabled: true },
        attributes: ['id', 'path'],
      });

      // Incluir categorias para retornar os IDs
      include.push({
        model: CategoriaModel,
        as: 'categorias',
        through: { attributes: [] },
        attributes: ['id'],
        required: false,
      });

      // Definir campos a serem retornados
      let attributes = undefined;
      if (fields) {
        // Separar os campos e mapear para os nomes corretos
        const fieldList = fields.split(',');
        attributes = fieldList.filter((field) =>
          [
            'id',
            'enabled',
            'name',
            'slug',
            'stock',
            'description',
            'price',
            'price_with_discount',
          ].includes(field),
        );
      }

      // Montando as opções de consulta
      let options = {
        where,
        attributes,
        include,
        distinct: true, // Importante para contar corretamente com includes
        subQuery: false, // Para evitar problemas com paginação e includes
      };

      // Aplicar paginação (apenas se limit não for -1)
      if (limit !== -1) {
        options.limit = limit;
        options.offset = (page - 1) * limit;
        options.order = [['id', 'ASC']];
      } else {
        // Se limit = -1, não aplicar paginação
        options.order = [['id', 'ASC']];
      }

      // Buscar produtos
      const { count, rows } = await ProductModel.findAndCountAll(options);

      // Formatar os dados conforme o requisito
      const formattedData = rows.map((produto) => {
        // Extrair apenas os IDs das categorias
        const category_ids = produto.categorias
          ? produto.categorias.map((cat) => cat.id)
          : [];

        // Formatar imagens
        const images = produto.images
          ? produto.images.map((img) => ({
              id: img.id,
              content: img.path, // Você pode ajustar para URL completa depois
            }))
          : [];

        // Formatar opções (já estão no formato correto)
        const options = produto.options
          ? produto.options.map((opt) => ({
              id: opt.id,
              title: opt.title,
              shape: opt.shape,
              radius: opt.radius,
              type: opt.type,
              values: opt.values, // Já vem como string do banco
            }))
          : [];

        // Construir objeto do produto
        const produtoFormatado = {
          id: produto.id,
          enabled: produto.enabled,
          name: produto.name,
          slug: produto.slug,
          stock: produto.stock,
          description: produto.description,
          price: produto.price,
          price_with_discount: produto.price_with_discount,
          category_ids,
          images,
          options,
        };

        // Remover campos não solicitados se fields foi especificado
        if (fields) {
          const fieldList = fields.split(',');
          Object.keys(produtoFormatado).forEach((key) => {
            if (!fieldList.includes(key) && key !== 'id') {
              delete produtoFormatado[key];
            }
          });
        }

        return produtoFormatado;
      });

      // Retornar resposta formatada
      return response.json({
        data: formattedData,
        total: count,
        limit: limit === -1 ? count : limit,
        page: limit === -1 ? 1 : page,
      });
    } catch (error) {
      return response.status(400).json({
        error: error.message,
      });
    }
  }

  // ============================== SEARCH POR ID =================================
  async consultarPorId(request, response) {
    try {
      const { id } = request.params;

      const produto = await ProductModel.findByPk(id, {
        include: [
          {
            model: ImageProductModel,
            as: 'images',
            attributes: ['id', 'path'],
            where: { enabled: true },
            required: false,
          },
          {
            model: OptionProductModel,
            as: 'options',
            attributes: ['id', 'title', 'shape', 'radius', 'type', 'values'],
            required: false,
          },
          {
            model: CategoriaModel,
            as: 'categorias',
            through: { attributes: [] },
            attributes: ['id'],
            required: false,
          },
        ],
      });

      // Se não encontrar o produto, retorna 404
      if (!produto) {
        return response.status(404).json({
          message: 'Produto não encontrado',
        });
      }

      // Formatando a resposta exatamente como solicitado
      const responseBody = {
        id: produto.id,
        enabled: produto.enabled,
        name: produto.name,
        slug: produto.slug,
        stock: produto.stock,
        description: produto.description,
        price: produto.price,
        price_with_discount: produto.price_with_discount,
        category_ids: produto.categorias.map((cat) => cat.id),
        images: produto.images.map((img) => ({
          id: img.id,
          content: img.path, // Aqui você pode concatenar a URL base se desejar
        })),
        options: produto.options.map((opt) => ({
          id: opt.id,
          title: opt.title,
          shape: opt.shape,
          radius: opt.radius,
          type: opt.type,
          values: opt.values,
        })),
      };

      return response.status(200).json(responseBody);
    } catch (error) {
      return response.status(400).json({
        error: error.message,
      });
    }
  }

  // ============================== CRIAR =================================
  async criar(request, response) {
    // Usando transação para garantir consistência
    const transaction = await ProductModel.sequelize.transaction();

    try {
      // Pegando os dados do body
      const {
        enabled,
        name,
        slug,
        stock,
        description,
        price,
        price_with_discount,
        category_ids,
        images,
        options,
      } = request.body;

      // 1. Criar o produto
      const produto = await ProductModel.create(
        {
          enabled: enabled !== undefined ? enabled : false,
          name,
          slug,
          stock: stock !== undefined ? stock : 0,
          description: description || null,
          price,
          price_with_discount,
          use_in_menu: false, // valor padrão
        },
        { transaction },
      );

      // 2. Associar as categorias (se houver)
      if (category_ids && category_ids.length > 0) {
        const categoriasParaSalvar = category_ids.map((category_id) => ({
          product_id: produto.id,
          category_id: category_id,
        }));

        await ProductCategoryModel.bulkCreate(categoriasParaSalvar, {
          transaction,
        });
      }

      // 3. Salvar as imagens (se houver)
      if (images && images.length > 0) {
        const imagensParaSalvar = images.map((imagem, index) => ({
          product_id: produto.id,
          enabled: true,
          path: `uploads/${produto.id}/${Date.now()}_${index}.${imagem.type.split('/')[1]}`,
        }));

        await ImageProductModel.bulkCreate(imagensParaSalvar, { transaction });
      }

      // 4. Salvar as opções (se houver)
      if (options && options.length > 0) {
        const opcoesParaSalvar = options.map((opcao) => ({
          product_id: produto.id,
          title: opcao.title,
          shape: opcao.shape || 'square',
          radius: opcao.radius || 0,
          type: opcao.type || 'text',
          values: Array.isArray(opcao.values)
            ? opcao.values.join(',')
            : opcao.values,
        }));

        await OptionProductModel.bulkCreate(opcoesParaSalvar, { transaction });
      }

      // Commit da transação
      await transaction.commit();

      // Retornar sucesso
      return response.status(201).json({
        message: 'Produto criado com sucesso',
        product_id: produto.id,
      });
    } catch (error) {
      // Rollback em caso de erro
      await transaction.rollback();
      return response.status(400).json({
        error: error.message,
      });
    }
  }

  // ============================== ATUALIZAR =================================
  async atualizar(request, response) {
    const transaction = await ProductModel.sequelize.transaction();
    try {
      const { id } = request.params;
      const {
        enabled,
        name,
        slug,
        stock,
        description,
        price,
        price_with_discount,
        category_ids,
        images,
        options,
      } = request.body;

      // 1. Verificar se o produto existe
      const produto = await ProductModel.findByPk(id, { transaction });
      if (!produto) {
        await transaction.rollback();
        return response.status(404).json({ message: 'Produto não encontrado' });
      }

      // 2. Atualizar dados básicos do produto
      await produto.update(
        {
          enabled: enabled !== undefined ? enabled : produto.enabled,
          name: name || produto.name,
          slug: slug || produto.slug,
          stock: stock !== undefined ? stock : produto.stock,
          description:
            description !== undefined ? description : produto.description,
          price: price !== undefined ? price : produto.price,
          price_with_discount:
            price_with_discount !== undefined
              ? price_with_discount
              : produto.price_with_discount,
        },
        { transaction },
      );

      // 3. Sincronizar Categorias (Muitos para Muitos)
      if (category_ids) {
        // Remove associações antigas e cria as novas
        await ProductCategoryModel.destroy({
          where: { product_id: id },
          transaction,
        });
        const categoriasParaSalvar = category_ids.map((catId) => ({
          product_id: id,
          category_id: catId,
        }));
        await ProductCategoryModel.bulkCreate(categoriasParaSalvar, {
          transaction,
        });
      }

      // 4. Sincronizar Imagens
      if (images && images.length > 0) {
        for (const img of images) {
          if (img.id && img.deleted) {
            await ImageProductModel.destroy({
              where: { id: img.id },
              transaction,
            });
          } else if (!img.id) {
            // Criar nova imagem (simulação de upload com o content base64)
            await ImageProductModel.create(
              {
                product_id: id,
                enabled: true,
                path: `uploads/${id}/new_${Date.now()}.${img.type.split('/')[1]}`,
              },
              { transaction },
            );
          }
          // Se tiver ID e content, você poderia atualizar o path aqui
        }
      }

      // 5. Sincronizar Opções
      if (options && options.length > 0) {
        for (const opt of options) {
          if (opt.id && opt.deleted) {
            await OptionProductModel.destroy({
              where: { id: opt.id },
              transaction,
            });
          } else if (opt.id) {
            // Atualizar opção existente
            await OptionProductModel.update(
              {
                radius: opt.radius,
                values: Array.isArray(opt.values)
                  ? opt.values.join(',')
                  : opt.values,
              },
              { where: { id: opt.id }, transaction },
            );
          } else {
            // Criar nova opção
            await OptionProductModel.create(
              {
                product_id: id,
                title: opt.title,
                shape: opt.shape || 'square',
                type: opt.type || 'text',
                values: Array.isArray(opt.values)
                  ? opt.values.join(',')
                  : opt.values,
              },
              { transaction },
            );
          }
        }
      }

      await transaction.commit();
      return response.status(204).send(); // Sucesso sem corpo
    } catch (error) {
      await transaction.rollback();
      return response.status(400).json({ error: error.message });
    }
  }

  // ============================== DELETAR =================================
  async deletar(request, response) {
    // Iniciando transação para garantir que o produto e suas relações sejam tratados juntos
    const transaction = await ProductModel.sequelize.transaction();

    try {
      const { id } = request.params;

      // 1. Verificar se o produto existe antes de tentar deletar
      const produto = await ProductModel.findByPk(id, { transaction });

      if (!produto) {
        await transaction.rollback();
        return response.status(404).json({
          message: 'Produto não encontrado',
        });
      }

      // 2. Remover associações nas tabelas filhas primeiro (opcional dependendo do ON DELETE CASCADE)
      // Deleta referências de categorias, imagens e opções
      await ProductCategoryModel.destroy({
        where: { product_id: id },
        transaction,
      });
      await ImageProductModel.destroy({
        where: { product_id: id },
        transaction,
      });
      await OptionProductModel.destroy({
        where: { product_id: id },
        transaction,
      });

      // 3. Deletar o produto principal
      await ProductModel.destroy({
        where: { id },
        transaction,
      });

      // 4. Confirmar as alterações
      await transaction.commit();

      // Retornar 204 No Content como pede o requisito
      return response.status(204).send();
    } catch (error) {
      // Em caso de qualquer erro, desfaz todas as exclusões
      await transaction.rollback();
      return response.status(400).json({
        error: error.message,
      });
    }
  }
}

module.exports = ProductController;
