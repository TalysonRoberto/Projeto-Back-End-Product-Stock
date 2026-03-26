// Importa model de usuário e biblioteca de criptografia
const UserModel = require('../models/UserModel');
const MD5 = require('crypto-js/md5');

// Controlador de autenticação
class AuthController {
  // Realiza login do usuário
  async login(email, password) {
    console.log('EMAIL RECEBIDO:', email);
    console.log('PASSWORD ORIGINAL:', password);
    console.log('PASSWORD MD5:', MD5(password).toString());

    // Busca usuário com email e senha criptografada
    const dados = await UserModel.findOne({
      where: {
        email: email,
        password: MD5(password).toString(),
      },
    });

    console.log('USUARIO ENCONTRADO:', dados);
    return dados; // Retorna usuário ou null
  }
}

module.exports = AuthController;
