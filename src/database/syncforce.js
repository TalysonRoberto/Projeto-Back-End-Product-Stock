const connection = require('../config/connection');

// Importação dos modelos na ordem de dependência
require('../models/UserModel');
require('../models/CategoriaModel');
require('../models/ProductModel');
require('../models/ImageProductModel');
require('../models/OptionProductModel');
require('../models/ProductCategoryModel');

// // ----------- ADD NEW-----------

connection.sync({ force: true });
