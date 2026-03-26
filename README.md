# Projeto Back-end Product Stock

### 📖 Sobre o Projeto

Este é um projeto de back-end desenvolvido durante o curso de Desenvolvedor Web Full Stack. O objetivo é criar uma API RESTful completa para gerenciamento de produtos, categorias, usuários e autenticação, simulando um sistema de estoque e-commerce.

### 🎯 Funcionalidades

- ✅ Autenticação de usuários com JWT (JSON Web Token)
- ✅ CRUD completo de usuários (cadastro, listagem, atualização, deleção)
- ✅ CRUD completo de categorias (com paginação e filtros)
- ✅ CRUD completo de produtos (com imagens e opções)
- ✅ Filtros avançados para produtos (preço, categorias, busca por nome)
- ✅ Paginação em todas as listagens
- ✅ Documentação interativa com Swagger
- ✅ Testes automatizados com Jest e Supertest

# 🔧 Dependencias do projeto

### Dependências de Produção

```bash
npm install express sequelize mysql2 dotenv jsonwebtoken crypto-js nodemon swagger-jsdoc swagger-ui-express
```

- **express** ^5.2.1 -> Framework web para Node.js
- **sequelize** ^6.37.8 -> ORM para Node.js (mapeamento objeto-relacional)
- **mysql2** ^3.19.1 -> Driver MySQL para Node.js
- **dotenv** ^17.3.1 -> Gerenciamento de variáveis de ambiente
- **jsonwebtoken** ^9.0.3 -> Geração e validação de tokens JWT
- **crypto-js** ^4.2.0 -> Biblioteca para criptografia MD5
- **nodemon** ^3.1.14 -> Monitora alterações e reinicia o servidor automaticamente
- **swagger-jsdoc** ^6.2.8 -> Gera documentação Swagger a partir de comentários JSDoc
- **swagger-ui-express** ^5.0.1 -> Interface gráfica para documentação Swagger

### Dependências de Desenvolvimento

```bash
npm install --save-dev jest supertest
```

- **jest** ^30.3.0 -> Framework de testes
- **supertest** ^7.2.2 -> Biblioteca para testes de API HTTP

# ⚙️ Instalando e configurando projeto

1. Clone o repositório

```h
https://github.com/TalysonRoberto/Projeto-Back-End-Product-Stock.git
```

2. Realize a instalação das dependencias do topico `🔧 Dependencias do projeto`

3. Crie e configure o arquivo .env caso não tenha baixado com o repositório

```js
DB_NAME=products
DB_USER=root
DB_PASS=root

PORT=3000
APP_KEY_TOKEN=senha-super-segura

APP_TEMP=1h
```

4. Configure o banco de dados `MySQL`

![banco](./Doc/bank_config.png)

5. Crie o banco `products`

6. Configure o `scripts` do `packge.json`

```json
"scripts": {
    "start": "node src/server.js",
    "sync": "node src/database/syncforce.js",
    "dev": "nodemon src/server.js",
    "test": "jest --runInBand",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
```

7. Inicie o projeto com o comando

```
npm rum start
```

Nesse momento sera gerado um token.

![token](./Doc/project_init.png)

8. Crie e sincronise as tabelas no banco com o comando

```
npm run sync
```

# 🧩 Estrutura do Projeto Backend

```src/
├── config/
│   └── connection.js           # Configuração da conexão com o banco de dados
├── controllers/
│   ├── AuthController.js        # Lógica de autenticação (Login/Logout)
│   ├── CategoriaController.js   # Regras de negócio para Categorias
│   ├── ProductController.js     # Regras de negócio para Produtos
│   └── UserController.js        # Regras de negócio para Usuários
├── database/
│   ├── execute.js               # Scripts de execução de comandos SQL/Migrations
│   └── syncforce.js             # Script para forçar a sincronização do Sequelize
├── middleware/
│   └── auth.js                  # Interceptor para validar o token JWT
├── models/
│   ├── CategoriaModel.js        # Definição da tabela de Categorias
│   ├── ImageProductModel.js     # Definição da tabela de Imagens do Produto
│   ├── OptionProductModel.js    # Definição da tabela de Opções do Produto
│   ├── ProductCategoryModel.js  # Tabela pivot (N:N) entre Produtos e Categorias
│   ├── ProductModel.js          # Definição da tabela de Produtos
│   └── UserModel.js             # Definição da tabela de Usuários
├── routes/
│   ├── CategoriaRotas.js        # Definição dos endpoints de categorias
│   ├── ProductRotas.js          # Definição dos endpoints de produtos
│   ├── RotasPrivadas.js         # Agrupamento de rotas que exigem login
│   ├── RotasPublicas.js         # Agrupamento de rotas abertas
│   ├── UserRotas.js             # Definição dos endpoints de usuários
│   ├── app.js                   # Configuração principal do Express (Middlewares)
│   └── server.js                # Inicialização do servidor (Listen)
├── teste/
│   ├── helpers/
│   │   ├── integration/         # Testes de integração (API completa)
│   │   │   ├── auth.test.js
│   │   │   ├── categoria.test.js
│   │   │   ├── product.test.js
│   │   │   └── user.test.js
│   │   ├── dbHelper.js          # Funções auxiliares para limpar/popular banco em testes
│   │   └── setup.js             # Configurações globais para o ambiente de teste
│   └── jest.config.js           # Configuração da ferramenta de testes Jest
└── .env                         # Variáveis de ambiente (Senhas, Portas, etc)
```

# 🗄️ Modelos do Banco de Dados

<details>
    <summary><strong>1. Usuário (UserModel)</strong></summary><br>

| Campo     | Tipo       | Descrição                       |
| --------- | ---------- | ------------------------------- |
| id        | INTEGER    | Chave primária (auto increment) |
| firstname | STRING(45) | Nome do usuário                 |
| surname   | STRING(45) | Sobrenome do usuário            |
| email     | STRING(45) | E-mail do usuário (único)       |
| password  | STRING(45) | Senha criptografada em MD5      |

</details>

<details>
    <summary><strong>2. Categoria (CategoriaModel)</strong></summary><br>

| Campo       | Tipo        | Descrição                       |
| ----------- | ----------- | ------------------------------- |
| id          | INTEGER     | Chave primária (auto increment) |
| name        | STRING(100) | Nome da categoria               |
| slug        | STRING(100) | Slug para URL                   |
| use_in_menu | BOOLEAN     | Exibir no menu                  |

</details>

<details>
  <summary><strong>3. Produto (ProductModel)</strong></summary><br>

| Campo               | Tipo       | Descrição                       |
| ------------------- | ---------- | ------------------------------- |
| id                  | INTEGER    | Chave primária (auto increment) |
| enabled             | BOOLEAN    | Status do produto               |
| name                | STRING(45) | Nome do produto                 |
| slug                | STRING(45) | Slug para URL                   |
| stock               | INTEGER    | Quantidade em estoque           |
| description         | STRING     | Descrição do produto            |
| price               | FLOAT      | Preço original                  |
| price_with_discount | FLOAT      | Preço com desconto              |
| use_in_menu         | BOOLEAN    | Exibir no menu                  |
| created_at          | TIMESTAMP  | Data de criação                 |
| updated_at          | TIMESTAMP  | Data de atualização             |

</details>

# 📍 Rotas

Todos os comandos da API necessita da permissão do TOKEN , passe esse parâmetro no `Headers`.

![headers](./Doc/headers.png)

<details>
    <summary><strong>Rota Token</strong></summary><br>

### **POST** `/token` Gera um token de acesso (Login)

body

```json
{
  "email": "talyson@gmail.com",
  "password": "123456"
}
```

Resposta

```json
{
  "message": "Login realizado com sucesso",
  "data": {
    "id": 472,
    "firstname": "talyson",
    "surname": "talyson",
    "email": "talyson@gmail.com",
    "password": "e10adc3949ba59abbe56e057f20f883e",
    "createdAt": "2026-03-25T20:09:33.000Z",
    "updatedAt": "2026-03-25T20:09:33.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDcyLCJlbWFpbCI6InRhbHlzb25AZ21haWwuY29tIiwiaWF0IjoxNzc0NDY5Mzk3LCJleHAiOjE3NzQ1NTU3OTd9.hoPlTYS7sxDKRU3C4uYFhmLoyczzUT7EYUgZatJiFrA"
}
```

</details>

<details>
    <summary><strong> Rotas do Usuários (CRUD)</strong></summary><br>

### **GET** `/v1/users/` Lista todos os usuários

Resposta

```json
[
  {
    "id": 1,
    "firstname": "talyson",
    "surname": "talyson",
    "email": "talyson@gmail.com",
    "createdAt": "2026-03-25T20:09:33.000Z",
    "updatedAt": "2026-03-25T20:09:33.000Z"
  },
  {
    "id": 2,
    "firstname": "Teste",
    "surname": "Usuário",
    "email": "teste@teste.com",
    "createdAt": "2026-03-25T20:07:42.000Z",
    "updatedAt": "2026-03-25T20:07:42.000Z"
  }
]
```

---

### **GET** `/v1/users/{id}` Busca usuário por ID

Rota

```bash
http://localhost:3000/v1/users/1
```

Resposta

```json
{
  "id": 1,
  "firstname": "talyson",
  "surname": "talyson",
  "email": "talyson@gmail.com",
  "createdAt": "2026-03-25T21:07:43.000Z",
  "updatedAt": "2026-03-25T21:07:43.000Z"
}
```

---

### **POST** `/v1/users` Cria um novo usuário

body

```json
{
  "firstname": "talyson",
  "surname": "talyson",
  "email": "talyson@gmail.com",
  "password": "123456"
}
```

Resposta

```json
{
  "message": "Usuario cadastrado com sucesso!"
}
```

---

### **PUT** `/v1/users/{id}` Atualiza um usuário existente

Rota

```h
http://localhost:3000/v1/users/1
```

body

```json
{
  "firstname": "Roberto"
}
```

Resposta

```json
{
  "message": "Usuário atualizado com sucesso"
}
```

---

### **DELETE** `/v1/users/{id}` Deleta um usuário

Rota

```h
http://localhost:3000/v1/users/1
```

Resosta

```json
{
  "message": "Usuário deletado com sucesso"
}
```

</details>

<details>
    <summary><strong>Rotas do Produto (CRUD)</strong></summary><br>

### **GET** `/v1/product/search` Lista produtos com filtros e paginação

Rota

```h
http://localhost:3000/v1/product/search?limit=-1
```

Resposta

```json
{
  "data": [
    {
      "id": 101,
      "enabled": true,
      "name": "Smartphone Pro Max",
      "slug": "smartphone-pro-max",
      "stock": 15,
      "description": "Smartphone com câmera de 108MP, 256GB de armazenamento e bateria de longa duração.",
      "price": 3499.9,
      "price_with_discount": 2999.9,
      "category_ids": [199],
      "images": [
        {
          "id": 2,
          "content": "uploads/101/1774474307546_1.jpg"
        },
        {
          "id": 1,
          "content": "uploads/101/1774474307546_0.png"
        }
      ],
      "options": [
        {
          "id": 2,
          "title": "Cor",
          "shape": "circle",
          "radius": 0,
          "type": "color",
          "values": "#000000,#FFD700,#808080"
        },
        {
          "id": 1,
          "title": "Capacidade",
          "shape": "square",
          "radius": 8,
          "type": "text",
          "values": "128GB,256GB,512GB"
        }
      ]
    }
  ],
  "total": 1,
  "limit": 1,
  "page": 1
}
```

### Outras pesquisas

#### 1\. **Listar todos os produtos (com paginação padrão)**

```
GET http://localhost:3000/v1/product/search
```

#### 2\. **Listar com limit personalizado**

```
GET http://localhost:3000/v1/product/search?limit=5
```

#### 3\. **Listar todos os produtos (sem paginação)**

```
GET http://localhost:3000/v1/product/search?limit=-1
```

#### 4\. **Buscar por termo (match no nome ou descrição)**

```
GET http://localhost:3000/v1/product/search?match=Produto
```

#### 5\. **Filtrar por categorias**

```
GET http://localhost:3000/v1/product/search?category_ids=1,2,3
```

#### 6\. **Filtrar por faixa de preço**

```
GET http://localhost:3000/v1/product/search?price-range=50-150
```

#### 7\. **Selecionar campos específicos**

```
GET http://localhost:3000/v1/product/search?fields=id,name,price,images
```

#### 8\. **Combinar múltiplos filtros**

```
GET http://localhost:3000/v1/product/search?match=Produto&category_ids=1,2&price-range=50-150&limit=10&page=2&fields=id,name,price,category_ids
```

#### 9\. **Filtrar por opções (quando implementado)**

```
GET http://localhost:3000/v1/product/search?option[1]=PP,GG&option[2]=#000000
```

---

### **GET** `/v1/product/{id}` Busca produto pelo ID

Pamâmetro

```h
http://localhost:3000/v1/product/103
```

Resposta

```json
{
  "id": 103,
  "enabled": true,
  "name": "Tênis Esportivo Runner",
  "slug": "tenis-esportivo-runner",
  "stock": 25,
  "description": "Tênis ideal para corrida e atividades físicas. Solado antiderrapante e amortecimento premium para máximo conforto.",
  "price": 299.9,
  "price_with_discount": 249.9,
  "category_ids": [198, 199],
  "images": [
    {
      "id": 3,
      "content": "uploads/103/1774474629073_0.png"
    },
    {
      "id": 4,
      "content": "uploads/103/1774474629073_1.jpg"
    }
  ],
  "options": [
    {
      "id": 3,
      "title": "Tamanho",
      "shape": "square",
      "radius": 8,
      "type": "text",
      "values": "34,35,36,37,38,39,40,41,42"
    },
    {
      "id": 4,
      "title": "Cor",
      "shape": "circle",
      "radius": 0,
      "type": "color",
      "values": "#000000,#FFFFFF,#FF0000,#0000FF"
    }
  ]
}
```

---

### **POST** `/v1/product` Criar novo produto

body

```json
{
  "enabled": true,
  "name": "Smartphone Pro Max",
  "slug": "smartphone-pro-max",
  "stock": 15,
  "description": "Smartphone com câmera de 108MP, 256GB de armazenamento e bateria de longa duração.",
  "price": 3499.9,
  "price_with_discount": 2999.9,
  "category_ids": [199],
  "images": [
    {
      "type": "image/png",
      "content": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    },
    {
      "type": "image/jpg",
      "content": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
    }
  ],
  "options": [
    {
      "title": "Capacidade",
      "shape": "square",
      "radius": 8,
      "type": "text",
      "values": ["128GB", "256GB", "512GB"]
    },
    {
      "title": "Cor",
      "shape": "circle",
      "type": "color",
      "values": ["#000000", "#FFD700", "#808080"]
    }
  ]
}
```

Resposta

```json
{
  "message": "Produto criado com sucesso",
  "product_id": 101
}
```

---

### **PUT** `/v1/product/{id}`Atualiza um produto existente

Rota

```h
http://localhost:3000/v1/product/106
```

Body

```json
{
  "enabled": true,
  "name": "Tênis Nike Air Max Atualizado",
  "slug": "tenis-nike-air-max-atualizado",
  "stock": 50,
  "description": "Nova descrição para o produto em estoque",
  "price": 599.9,
  "price_with_discount": 450.0,
  "category_ids": [199],
  "images": [
    {
      "type": "image/png",
      "content": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
    },
    {
      "id": 10,
      "deleted": true
    }
  ],
  "options": [
    {
      "id": 5,
      "radius": 10,
      "values": ["40", "41", "42"]
    },
    {
      "title": "Cor",
      "shape": "circle",
      "type": "color",
      "values": ["#000000", "#FFFFFF"]
    }
  ]
}
```

Resposta

- Status `204`

---

### **DELETE** `/v1/product/{id}` Deleta um produto

Rota

```h
http://localhost:3000/v1/product/106
```

Resposta

- Status `204`

</details>

<details>
    <summary><strong>Rotad da Categoria (CRUD)</strong></summary><br>

### **GET** `/v1/categoria/search` Lista categoria

Resposta

```json
{
  "data": [
    {
      "id": 1,
      "name": "blusa",
      "slug": "blusa",
      "use_in_menu": false
    },
    {
      "id": 2,
      "name": "sapatos",
      "slug": "sapatos",
      "use_in_menu": false
    },
    {
      "id": 3,
      "name": "chapeus",
      "slug": "chapeus",
      "use_in_menu": false
    },
    {
      "id": 4,
      "name": "calças",
      "slug": "calças",
      "use_in_menu": false
    }
  ],
  "total": 4,
  "limit": 12,
  "page": 1
}
```

### Outra pesquisas

#### Pesquisar com filtro

```
http://localhost:3000/v1/categoria/search?fields=name

```

#### Pesquisar sem filtro

```
http://localhost:3000/v1/categoria/search
http://localhost:3000/v1/categoria/search?use_in_menu=false

```

#### Pesquisa com limite

```
http://localhost:3000/v1/categoria/search?limit=2&page=1

```

---

### **GET** `/v1/categoria/{id}` Busca categoria pelo ID

Rota

```h
http://localhost:3000/v1/categoria/5
```

Resposta

```json
{
  "id": 5,
  "name": "calças",
  "slug": "calças",
  "use_in_menu": false
}
```

---

### **POST** `/v1/categoria` Criar nova categoria

body

```json
{
  "name": "blusa",
  "slug": "blusa",
  "use_in_menu": false
}
```

Resposta

```json
{
  "message": "Categoria criada com sucesso"
}
```

---

### **PUT** `/v1/categoria/{id}`Atualiza uma categoria

Rota

```h
http://localhost:3000/v1/categoria/5
```

body

```json
{
  "name": "Relógios",
  "slug": "Relógios",
  "use_in_menu": true
}
```

Reposta

- Status `204`

---

### **DELETE** `/v1/categoria/{id}` Deleta uma categoria

Rota

```h
http://localhost:3000/v1/categoria/5
```

Reposta

- Status `204`

</details>

# Swagger

No Swagger é possivel realizar todo as ações da API.
Gere o TOKEN na autenticação ou pegue direto no terminal quando o projeto é executado (conforme mostrado no item `Inicie o projeto com o comando` do tópico `⚙️ Instalando e configurando projeto`).

Rota

```h
http://localhost:3000/api-docs/
```

![auth](./Doc/swagger_auth.png)

![user](./Doc/swagger_user.png)

![product](./Doc/swagger_product.png)

![category](./Doc/swagger_category.png)

---

# 🧪 Teste

<details>
    <summary><strong>1. Comandos Básicos</strong></summary><br>

```bash
# Executar todos os testes
npm test

# Executar todos os testes com mais detalhes
npm test -- --verbose
```

Resultado esperado:

![teste_geral](./Doc/teste_geral.png)

</details>

<details>
    <summary><strong>2. Executar testes específicos</strong></summary><br>

- user

```bash
# Apenas testes de usuário
npm test -- user.test.js
```

![teste_user](./Doc/teste_user.png)

- categoria

```bash
# Apenas testes de categoria
npm test -- categoria.test.js
```

![teste_categoria](./Doc/teste_categoria.png)

- Produto

```bash
# Apenas testes de produto
npm test -- product.test.js
```

![teste_produto](./Doc/teste_produto.png)

- Auth

```bash
# Apenas testes de autenticação
npm test -- auth.test.js
```

![teste_auth](./Doc/teste_auth.png)

</details>
