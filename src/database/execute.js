const UserModel = require('../models/UserModel');

// Teste de criação de usuário
async function execute() {
  let user = await UserModel.create({
    firstname: 'Mika',
    surname: 'Sousa',
    email: 'Mika@gmail.com',
    password: 'e10adc3949ba59abbe56e057f20f883e', // Usar password:123456 para gerar o primeiro token
  });
}

execute();
