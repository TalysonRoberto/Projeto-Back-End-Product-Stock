//====================================================
//               CONTROLLER USUÁRIO
//====================================================
const MD5 = require('crypto-js/md5');
const UserModel = require('../models/UserModel');

class UserController {
  // ============================== LISTAR =================================
  async listar(request, response) {
    try {
      let query = request.query;
      let users = [];

      if (query.fields) {
        const fields = query.fields.split(',');

        if (fields.includes('password')) {
          return response.status(400).json({
            message: 'O parametro solicitado não pode ser passado',
            motivo: 'A solicitação esta fora do requisito de segurança',
          });
        }

        users = await UserModel.findAll({
          attributes: fields,
        });
      } else {
        users = await UserModel.findAll({
          attributes: { exclude: ['password'] },
        });
      }

      return response.json(users);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  // ============================== CONSULTAR POR ID =================================
  async consultarPorId(request, response) {
    try {
      const { id } = request.params;

      const user = await UserModel.findByPk(id, {
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        return response.status(404).json({
          message: 'Usuário não encontrado',
        });
      }

      return response.json(user);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  // ============================== CRIAR =================================
  async criar(request, response) {
    try {
      const body = request.body;

      const password = MD5(String(body.password)).toString();
      body.password = password;

      await UserModel.create(body);

      return response.status(201).json({
        message: 'Usuario cadastrado com sucesso!',
      });
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }

  // ============================== ATUALIZAR POR ID =================================
  async atualizar(request, response) {
    try {
      const { id } = request.params;
      const body = request.body;

      const user = await UserModel.findByPk(id);

      if (!user) {
        return response.status(404).json({
          message: 'Usuário não encontrado',
        });
      }

      // Se atualizar senha, criptografa novamente
      if (body.password) {
        body.password = MD5(String(body.password)).toString();
      }

      await UserModel.update(body, {
        where: { id },
      });

      return response.json({
        message: 'Usuário atualizado com sucesso',
      });
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }

  // ============================== DELETAR POR ID =================================
  async deletar(request, response) {
    try {
      const { id } = request.params;

      const user = await UserModel.findByPk(id);

      if (!user) {
        return response.status(404).json({
          message: 'Usuário não encontrado',
        });
      }

      await UserModel.destroy({
        where: { id },
      });

      return response.json({
        message: 'Usuário deletado com sucesso',
      });
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;
