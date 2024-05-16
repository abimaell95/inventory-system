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

# Parte 2A: Funcionalidades CRUD para Proveedores

## Modelo de Proveedor

Define el modelo de proveedor en `models/supplierModel.js`.
```javascript
const connection = require('../config/db');

const Supplier = {
    getAll: (callback) => {
        connection.query('SELECT * FROM suppliers', (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    },
    getById: (id, callback) => {
        connection.query('SELECT * FROM suppliers WHERE id = ?', [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results[0]);
        });
    },
    create: (supplier, callback) => {
        const { name, contact_name, contact_email, contact_phone, address } = supplier;
        if (!name) {
            return callback(new Error('Missing required fields'));
        }
        const newSupplier = { name, contact_name, contact_email, contact_phone, address };
        connection.query('INSERT INTO suppliers SET ?', newSupplier, (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, { id: results.insertId, ...newSupplier });
        });
    },
    update: (id, supplier, callback) => {
        const { name, contact_name, contact_email, contact_phone, address } = supplier;
        if (!name) {
            return callback(new Error('Missing required fields'));
        }
        const updatedSupplier = { name, contact_name, contact_email, contact_phone, address };
        connection.query('UPDATE suppliers SET ? WHERE id = ?', [updatedSupplier, id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, { id, ...updatedSupplier });
        });
    },
    delete: (id, callback) => {
        connection.query('DELETE FROM suppliers WHERE id = ?', [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    }
};

module.exports = Supplier;
```

## Controlador de Proveedor

Define el controlador de proveedor en `controllers/supplierController.js`.
```javascript
const Supplier = require('../models/supplierModel');

const getAllSuppliers = (req, res) => {
    Supplier.getAll((err, suppliers) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(suppliers);
    });
};

const getSupplierById = (req, res) => {
    const { id } = req.params;
    Supplier.getById(id, (err, supplier) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(supplier);
    });
};

const createSupplier = (req, res) => {
    const newSupplier = req.body;
    Supplier.create(newSupplier, (err, supplier) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json(supplier);
    });
};

const updateSupplier = (req, res) => {
    const { id } = req.params;
    const updatedSupplier = req.body;
    Supplier.update(id, updatedSupplier, (err, supplier) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(supplier);
    });
};

const deleteSupplier = (req, res) => {
    const { id } = req.params;
    Supplier.delete(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(204).send();
    });
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
```

## Ruta de Proveedor

Define las rutas de proveedor en `routes/supplierRoutes.js`.
```javascript
const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

router.get('/', supplierController.getAllSuppliers);
router.get('/:id', supplierController.getSupplierById);
router.post('/', supplierController.createSupplier);
router.put('/:id', supplierController.updateSupplier);
router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;
```

## Integración de Rutas de Proveedor en `app.js`

Agrega las rutas de proveedor a la configuración principal de Express.
```javascript
const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');

app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

# Parte 2B: Funcionalidades CRUD para Órdenes

## Modelo de Orden

Define el modelo de orden en `models/orderModel.js`.
```javascript
const connection = require('../config/db');

const Order = {
    getAll: (callback) => {
        connection.query('SELECT * FROM orders', (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    },
    getById: (id, callback) => {
        connection.query('SELECT * FROM orders WHERE id = ?', [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results[0]);
        });
    },
    create: (order, callback) => {
        const { supplier_id, order_date, total_amount, status } = order;
        if (!supplier_id || !order_date || !total_amount) {
            return callback(new Error('Missing required fields'));
        }
        const newOrder = { supplier_id, order_date, total_amount, status };
        connection.query('INSERT INTO orders SET ?', newOrder, (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, { id: results.insertId, ...newOrder });
        });
    },
    update: (id, order, callback) => {
        const { supplier_id, order_date, total_amount, status } = order;
        if (!supplier_id || !order_date || !total_amount) {
            return callback(new Error('Missing required fields'));
        }
        const updatedOrder = { supplier_id, order_date, total_amount, status };
        connection.query('UPDATE orders SET ? WHERE id = ?', [updatedOrder, id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, { id, ...updatedOrder });
        });
    },
    delete: (id, callback) => {
        connection.query('DELETE FROM orders WHERE id = ?', [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    }
};

module.exports = Order;
```

## Controlador de Orden

Define el controlador de orden en `controllers/orderController.js`.
```javascript
const Order = require('../models/orderModel');

const getAllOrders = (req, res) => {
    Order.getAll((err, orders) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(orders);
    });
};

const getOrderById = (req, res) => {
    const { id } = req.params;
    Order.getById(id, (err, order) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(order);
    });
};

const createOrder = (req, res) => {
    const newOrder = req.body;
    Order.create(newOrder, (err, order) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json(order);
    });
};

const updateOrder = (req, res) => {
    const { id } = req.params;
    const updatedOrder = req.body;
    Order.update(id, updatedOrder, (err, order) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(order);
    });
};

const deleteOrder = (req, res) => {
    const { id } = req.params;
    Order.delete(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(204).send();
    });
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
```

## Ruta de Orden

Define las rutas de orden en `routes/orderRoutes.js`.
```javascript
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
```

## Integración de Rutas de Orden en `app.js`

Agrega las rutas de orden a la configuración principal de Express.
```javascript
const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```


# Parte 3: Implementación de Patrones de Diseño y Principios SOLID

## Aplicación de Patrones de Diseño

### Patrón Singleton
Utilizado para gestionar una única instancia de la conexión a la base de datos en `db.js`.
```javascript
const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

let instance = null;

class Database {
    constructor() {
        if (!instance) {
            this.connection = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });

            this.connection.connect((err) => {
                if (err) {
                    console.error('Error connecting to the database:', err);
                } else {
                    console.log('Connected to the MySQL database.');
                }
            });

            instance = this;
        }

        return instance;
    }

    getConnection() {
        return this.connection;
    }
}

const databaseInstance = new Database();
Object.freeze(databaseInstance);

module.exports = databaseInstance.getConnection();
```

### Patrón Factory Method
Utilizado para crear diferentes tipos de productos en `productFactory.js`.
```javascript
class Product {
    constructor(name, description, price, quantity) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
    }
}

class Electronic extends Product {
    constructor(name, description, price, quantity, warranty) {
        super(name, description, price, quantity);
        this.warranty = warranty;
    }
}

class Clothing extends Product {
    constructor(name, description, price, quantity, size, material) {
        super(name, description, price, quantity);
        this.size = size;
        this.material = material;
    }
}

class ProductFactory {
    static createProduct(type, ...args) {
        switch (type) {
            case 'electronic':
                return new Electronic(...args);
            case 'clothing':
                return new Clothing(...args);
            default:
                throw new Error('Invalid product type');
        }
    }
}

module.exports = ProductFactory;
```

### Patrón Observer
Utilizado para notificar cambios en el estado de las órdenes en `orderObserver.js`.
```javascript
class Order {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(data) {
        this.observers.forEach(observer => observer.update(data));
    }

    // Simulación de cambio de estado
    changeStatus(status) {
        this.notify({ status });
    }
}

class Observer {
    update(data) {
        console.log(`Order status updated to: ${data.status}`);
    }
}

const order = new Order();
const observer1 = new Observer();
const observer2 = new Observer();

order.subscribe(observer1);
order.subscribe(observer2);

order.changeStatus('completed'); // Notifica a los observadores
```

## Aplicación de Principios SOLID

### Single Responsibility Principle (SRP)
Cada clase y archivo debe tener una única responsabilidad. Ya hemos separado la lógica de la base de datos, el modelo, el controlador y las rutas.

### Open/Closed Principle (OCP)
Las entidades de software deben estar abiertas para extensión, pero cerradas para modificación.
```javascript
// Ejemplo en el modelo de producto
const Product = {
    getAll: (callback) => {
        connection.query('SELECT * FROM products', (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    },
    // Agrega nuevos métodos sin modificar los existentes
    getByCategory: (category, callback) => {
        connection.query('SELECT * FROM products WHERE category = ?', [category], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    }
    // Otros métodos...
};

module.exports = Product;
```

### Liskov Substitution Principle (LSP)
Las clases derivadas deben ser sustituibles por sus clases base sin alterar el comportamiento esperado del programa.
```javascript
// Ejemplo en la fábrica de productos
const ProductFactory = require('./productFactory');

const electronic = ProductFactory.createProduct('electronic', 'Laptop', 'A powerful laptop', 1000, 10, '2 years');
const clothing = ProductFactory.createProduct('clothing', 'T-Shirt', 'A cool T-shirt', 20, 100, 'L', 'Cotton');

// Podemos tratar `electronic` y `clothing` como instancias de `Product`
console.log(electronic instanceof Product); // true
console.log(clothing instanceof Product);   // true
```

### Interface Segregation Principle (ISP)
Los clientes no deben estar obligados a depender de interfaces que no utilizan.
```javascript
// Ejemplo de separación de interfaces
class Product {
    constructor(name, description, price, quantity) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
    }
}

class Electronic extends Product {
    constructor(name, description, price, quantity, warranty) {
        super(name, description, price, quantity);
        this.warranty = warranty;
    }

    getWarrantyInfo() {
        return `Warranty: ${this.warranty}`;
    }
}

class Clothing extends Product {
    constructor(name, description, price, quantity, size, material) {
        super(name, description, price, quantity);
        this.size = size;
        this.material = material;
    }

    getSizeInfo() {
        return `Size: ${this.size}`;
    }
}
```

### Dependency Inversion Principle (DIP)
Los módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deben depender de abstracciones.
```javascript
// Ejemplo de inversión de dependencias
class Database {
    connect() {
        throw new Error('Method not implemented');
    }
}

class MySQLDatabase extends Database {
    connect() {
        // Lógica para conectar a MySQL
        console.log('Connecting to MySQL...');
    }
}

class MongoDBDatabase extends Database {
    connect() {
        // Lógica para conectar a MongoDB
        console.log('Connecting to MongoDB...');
    }
}

class InventoryService {
    constructor(database) {
        this.database = database;
    }

    connectDatabase() {
        this.database.connect();
    }
}

// Uso del servicio con diferentes bases de datos
const mysqlService = new InventoryService(new MySQLDatabase());
mysqlService.connectDatabase();

const mongoService = new InventoryService(new MongoDBDatabase());
mongoService.connectDatabase();
```
