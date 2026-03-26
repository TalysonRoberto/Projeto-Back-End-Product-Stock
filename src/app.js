const express = require('express');
const RotasPrivadas = require('./routes/RotasPrivadas');
const RotasPublicas = require('./routes/RotasPublicas');

// Importa bibliotecas do Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json({ limit: '10mb' })); // Permite envio de imagens base64

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Product Stock',
      version: '1.0.0',
      description: 'Documentação da API de Produtos e Categorias',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        tokenAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'token',
          description: 'Token JWT obtido no endpoint /token',
        },
      },
    },
    security: [{ tokenAuth: [] }], // Segurança global
  },
  apis: ['./src/routes/*.js'], // Onde estão as rotas documentadas
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Estilos personalizados para o Swagger
const customCss = `
  .swagger-ui .topbar { background-color: #1e2a3a; }
  .auth-container { display: flex; gap: 15px; align-items: center; margin-right: 20px; }
  .auth-container input { padding: 8px 12px; border: 1px solid #3b4151; border-radius: 4px; width: 250px; }
  .auth-container button { padding: 8px 16px; background: #49cc90; color: white; border: none; border-radius: 4px; cursor: pointer; }
  .auth-container .clear-token { background: #f93e3e; }
  .token-status { font-size: 12px; padding: 4px 8px; border-radius: 4px; }
  .token-status.valid { background: #49cc90; color: white; }
  .token-status.invalid { background: #f93e3e; color: white; }
`;

// Script personalizado para autenticação no Swagger
const customJs = `
  function updateTokenStatus() {
    const token = localStorage.getItem('api_token');
    const statusSpan = document.getElementById('token-status');
    if (token) {
      statusSpan.textContent = '✅ Token ativo';
      statusSpan.className = 'token-status valid';
    } else {
      statusSpan.textContent = '❌ Sem token';
      statusSpan.className = 'token-status invalid';
    }
  }

  async function fazerLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const loginBtn = document.getElementById('login-btn');
    
    if (!email || !password) {
      alert('Digite email e senha');
      return;
    }
    
    loginBtn.textContent = 'Logando...';
    loginBtn.disabled = true;
    
    try {
      const response = await fetch('http://localhost:3000/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('api_token', data.token);
        updateTokenStatus();
        alert('✅ Login realizado com sucesso!');
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
      } else {
        alert('❌ ' + (data.message || 'Erro no login'));
      }
    } catch (error) {
      alert('❌ Erro ao conectar com o servidor');
    } finally {
      loginBtn.textContent = 'Login';
      loginBtn.disabled = false;
    }
  }
  
  function limparToken() {
    localStorage.removeItem('api_token');
    updateTokenStatus();
    alert('Token removido!');
  }
  
  // Adiciona os controles de autenticação na interface
  setTimeout(() => {
    const topbar = document.querySelector('.topbar .wrapper');
    if (topbar && !document.querySelector('.auth-container')) {
      const authDiv = document.createElement('div');
      authDiv.className = 'auth-container';
      authDiv.innerHTML = \`
        <input type="text" id="login-email" placeholder="Email" />
        <input type="password" id="login-password" placeholder="Senha" />
        <button id="login-btn">Login</button>
        <button id="clear-token-btn" class="clear-token">Limpar Token</button>
        <span id="token-status" class="token-status invalid">❌ Sem token</span>
      \`;
      topbar.appendChild(authDiv);
      
      document.getElementById('login-btn').addEventListener('click', fazerLogin);
      document.getElementById('clear-token-btn').addEventListener('click', limparToken);
      updateTokenStatus();
    }
    
    // Adiciona token em todas as requisições do Swagger
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const token = localStorage.getItem('api_token');
      if (token && args[1]) {
        args[1].headers = args[1].headers || {};
        args[1].headers['token'] = token;
      }
      return originalFetch.apply(this, args);
    };
  }, 1000);
`;

// Rota da documentação Swagger
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    customCss,
    customJs,
    swaggerOptions: {
      requestInterceptor: (request) => {
        const token = localStorage.getItem('api_token');
        if (token) request.headers['token'] = token;
        return request;
      },
    },
  }),
);

// Rotas da API
app.use(RotasPublicas); // Rotas públicas (login)
app.use(RotasPrivadas); // Rotas privadas (requer token)

module.exports = app;
