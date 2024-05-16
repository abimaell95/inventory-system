# Parte 1: Configuración del Proyecto y Conexión a la Base de Datos

## Paso 1: Configuración del Entorno

1. **Instalación de Node.js y npm**
   - Asegúrate de tener Node.js y npm instalados en tu sistema.

2. **Creación del Proyecto**
   - Crea un directorio para tu proyecto y navega a él.
   ```bash
   mkdir inventory-system
   cd inventory-system
   ```

3. **Inicialización del Proyecto**
   - Inicializa un nuevo proyecto Node.js.
   ```bash
   npm init -y
   ```

4. **Instalación de Dependencias**
   - Instala las dependencias necesarias: Express, MySQL y dotenv.
   ```bash
   npm install express mysql dotenv
   ```

## Paso 2: Configuración de Express

1. **Estructura del Proyecto**
   - Crea la siguiente estructura de directorios y archivos:
   ```
   inventory-system/
   ├── config/
   │   └── db.js
   ├── controllers/
   │   └── productController.js
   ├── models/
   │   └── productModel.js
   ├── routes/
   │   └── productRoutes.js
   ├── .env
   ├── app.js
   └── package.json
   ```

2. **Archivo `.env`**
   - Crea un archivo `.env` en el directorio raíz del proyecto para almacenar las variables de entorno.
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=password
   DB_NAME=inventory
   ```

3. **Configuración de la Base de Datos**
   - Configura la conexión a la base de datos en `config/db.js`.
   ```javascript
   const mysql = require('mysql');
   const dotenv = require('dotenv');

   dotenv.config();

   const connection = mysql.createConnection({
       host: process.env.DB_HOST,
       user: process.env.DB_USER,
       password: process.env.DB_PASSWORD,
       database: process.env.DB_NAME
   });

   connection.connect((err) => {
       if (err) {
           console.error('Error connecting to the database:', err);
           return;
       }
       console.log('Connected to the MySQL database.');
   });

   module.exports = connection;
   ```

4. **Configuración de Express**
   - Configura Express en `app.js`.
   ```javascript
   const express = require('express');
   const app = express();
   const productRoutes = require('./routes/productRoutes');

   app.use(express.json());
   app.use('/api/products', productRoutes);

   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}`);
   });
   ```

## Paso 3: Modelo de Producto

1. **Definición del Modelo**
   - Define el modelo de producto en `models/productModel.js`.
   ```javascript
   const connection = require('../config/db');

   const Product = {
       getAll: (callback) => {
           connection.query('SELECT * FROM products', (err, results) => {
               if (err) {
                   return callback(err);
               }
               callback(null, results);
           });
       },
       getById: (id, callback) => {
           connection.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
               if (err) {
                   return callback(err);
               }
               callback(null, results[0]);
           });
       },
       create: (product, callback) => {
           const { name, description, price, quantity } = product;
           if (!name || !price || !quantity) {
               return callback(new Error('Missing required fields'));
           }
           const newProduct = { name, description, price, quantity };
           connection.query('INSERT INTO products SET ?', newProduct, (err, results) => {
               if (err) {
                   return callback(err);
               }
               callback(null, { id: results.insertId, ...newProduct });
           });
       },
       update: (id, product, callback) => {
           const { name, description, price, quantity } = product;
           if (!name || !price || !quantity) {
               return callback(new Error('Missing required fields'));
           }
           const updatedProduct = { name, description, price, quantity };
           connection.query('UPDATE products SET ? WHERE id = ?', [updatedProduct, id], (err, results) => {
               if (err) {
                   return callback(err);
               }
               callback(null, { id, ...updatedProduct });
           });
       },
       delete: (id, callback) => {
           connection.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
               if (err) {
                   return callback(err);
               }
               callback(null, results);
           });
       }
   };

   module.exports = Product;
   ```

## Paso 4: Controlador de Producto

1. **Definición del Controlador**
   - Define el controlador de producto en `controllers/productController.js`.
   ```javascript
   const Product = require('../models/productModel');

   const getAllProducts = (req, res) => {
       Product.getAll((err, products) => {
           if (err) {
               return res.status(500).json({ error: err.message });
           }
           res.json(products);
       });
   };

   const getProductById = (req, res) => {
       const { id } = req.params;
       Product.getById(id, (err, product) => {
           if (err) {
               return res.status(500).json({ error: err.message });
           }
           res.json(product);
       });
   };

   const createProduct = (req, res) => {
       const newProduct = req.body;
       Product.create(newProduct, (err, product) => {
           if (err) {
               return res.status(500).json({ error: err.message });
           }
           res.status(201).json(product);
       });
   };

   const updateProduct = (req, res) => {
       const { id } = req.params;
       const updatedProduct = req.body;
       Product.update(id, updatedProduct, (err, product) => {
           if (err) {
               return res.status(500).json({ error: err.message });
           }
           res.json(product);
       });
   };

   const deleteProduct = (req, res) => {
       const { id } = req.params;
       Product.delete(id, (err, result) => {
           if (err) {
               return res.status(500).json({ error: err.message });
           }
           res.status(204).send();
       });
   };

   module.exports = {
       getAllProducts,
       getProductById,
       createProduct,
       updateProduct,
       deleteProduct
   };
   ```

## Paso 5: Rutas de Producto

1. **Definición de Rutas**
   - Define las rutas de producto en `routes/productRoutes.js`.
   ```javascript
   const express = require('express');
   const router = express.Router();
   const productController = require('../controllers/productController');

   router.get('/', productController.getAllProducts);
   router.get('/:id', productController.getProductById);
   router.post('/', productController.createProduct);
   router.put('/:id', productController.updateProduct);
   router.delete('/:id', productController.deleteProduct);

   module.exports = router;
   ```

Hasta aquí tenemos la configuración básica del proyecto y la implementación del CRUD para los productos.