const jwt = require('jsonwebtoken');

const authMiddleware = (request, response, next) => {
  // Tenta pegar o token de 'authorization' (padrão Swagger) ou do header 'token' (seu padrão antigo)
  const authHeader = request.headers.authorization || request.headers.token;

  if (!authHeader) {
    return response
      .status(401)
      .json({ message: 'Não Autorizado: Token ausente' });
  }

  // Se o token vier no formato "Bearer asdf123...", extraímos apenas o código
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  try {
    // Verifica o token usando a chave secreta do seu .env
    const decoded = jwt.verify(token, process.env.APP_KEY_TOKEN);

    // Opcional: Salva os dados do usuário logado na requisição para usar depois
    request.user = decoded;

    next(); // Passou na verificação, segue para a rota
  } catch (error) {
    return response
      .status(401)
      .json({ message: 'Não Autorizado: Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;
