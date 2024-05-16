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


# Parte 3A: Implementación de Patrones de Diseño (Singleton, Factory Method, Observer)

## 1. Patrón Singleton: Conexión a la Base de Datos

**Descripción**: Gestionar una única instancia de la conexión a la base de datos.

**Implementación**:

**Archivo**: `config/db.js`
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

**Aplicación en el Proyecto**:
- Actualiza los modelos para usar la instancia de conexión única.
```javascript
const connection = require('../config/db');
```

## 2. Patrón Factory Method: Creación de Productos

**Descripción**: Crear diferentes tipos de productos (electrónicos, ropa, etc.).

**Implementación**:

**Archivo**: `models/productFactory.js`
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

**Aplicación en el Proyecto**:
- Actualiza el controlador para crear productos utilizando la fábrica.
```javascript
const ProductFactory = require('../models/productFactory');

const createProduct = (req, res) => {
    const { type, name, description, price, quantity, warranty, size, material } = req.body;
    let newProduct;
    try {
        newProduct = ProductFactory.createProduct(type, name, description, price, quantity, warranty, size, material);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
    Product.create(newProduct, (err, product) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json(product);
    });
};
```

## 3. Patrón Observer: Notificaciones de Órdenes

**Descripción**: Notificar a los usuarios cuando el estado de una orden cambia.

**Implementación**:

**Archivo**: `models/orderObserver.js`
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

    changeStatus(status) {
        this.notify({ status });
    }
}

class Observer {
    update(data) {
        console.log(`Order status updated to: ${data.status}`);
    }
}

module.exports = { Order, Observer };
```

**Aplicación en el Proyecto**:
- Actualiza el controlador para notificar los cambios de estado de las órdenes.
```javascript
const { Order, Observer } = require('../models/orderObserver');

const order = new Order();
const observer1 = new Observer();
order.subscribe(observer1);

const updateOrderStatus = (req, res) => {
    const { id, status } = req.body;
    Order.updateStatus(id, status, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        order.changeStatus(status);
        res.json(result);
    });
};
```

# Parte 3B: Implementación de Patrones de Diseño (Decorator, Strategy, Command)

## 4. Patrón Decorator: Descuentos y Promociones

**Descripción**: Añadir funcionalidades adicionales a los productos, como descuentos y promociones.

**Implementación**:

**Archivo**: `models/productDecorator.js`
```javascript
class Product {
    constructor(name, description, price) {
        this.name = name;
        this.description = description;
        this.price = price;
    }

    getPrice() {
        return this.price;
    }
}

class ProductDecorator {
    constructor(product) {
        this.product = product;
    }

    getPrice() {
        return this.product.getPrice();
    }
}

class DiscountDecorator extends ProductDecorator {
    constructor(product, discount) {
        super(product);
        this.discount = discount;
    }

    getPrice() {
        return this.product.getPrice() * (1 - this.discount);
    }
}

class PromotionDecorator extends ProductDecorator {
    constructor(product, promotion) {
        super(product);
        this.promotion = promotion;
    }

    getPrice() {
        return this.product.getPrice() - this.promotion;
    }
}

module.exports = { Product, DiscountDecorator, PromotionDecorator };
```

**Aplicación en el Proyecto**:
- Actualiza el controlador para aplicar descuentos y promociones a los productos.
```javascript
const { Product, DiscountDecorator, PromotionDecorator } = require('../models/productDecorator');

const applyDiscount = (req, res) => {
    const { id, discount } = req.body;
    Product.getById(id, (err, product) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const discountedProduct = new DiscountDecorator(product, discount);
        res.json({ originalPrice: product.getPrice(), discountedPrice: discountedProduct.getPrice() });
    });
};

const applyPromotion = (req, res) => {
    const { id, promotion } = req.body;
    Product.getById(id, (err, product) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const promotedProduct = new PromotionDecorator(product, promotion);
        res.json({ originalPrice: product.getPrice(), promotedPrice: promotedProduct.getPrice() });
    });
};
```

## 5. Patrón Strategy: Estrategias de Precios

**Descripción**: Implementar diferentes estrategias de precios (temporada alta, temporada baja, descuentos por fidelidad).

**Implementación**:

**Archivo**: `models/priceStrategy.js`
```javascript
class PriceStrategy {
    getPrice(basePrice) {
        throw new Error('Method not implemented');
    }
}

class HighSeasonStrategy extends PriceStrategy {
    getPrice(basePrice) {
        return basePrice * 1.2;
    }
}

class LowSeasonStrategy extends PriceStrategy {
    getPrice(basePrice) {
        return basePrice * 0.8;
    }
}

class LoyaltyDiscountStrategy extends PriceStrategy {
    getPrice(basePrice) {
        return basePrice * 0.9;
    }
}

class PriceContext {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    calculatePrice(basePrice) {
        return this.strategy.getPrice(basePrice);
    }
}

module.exports = { PriceContext, HighSeasonStrategy, LowSeasonStrategy, LoyaltyDiscountStrategy };
```

**Aplicación en el Proyecto**:
- Actualiza el controlador para calcular precios utilizando diferentes estrategias.
```javascript
const { PriceContext, HighSeasonStrategy, LowSeasonStrategy, LoyaltyDiscountStrategy } = require('../models/priceStrategy');

const calculatePrice = (req, res) => {
    const { id, strategyType } = req.body;
    Product.getById(id, (err, product) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        let strategy;
        switch (strategyType) {
            case 'highSeason':
                strategy = new HighSeasonStrategy();
                break;
            case 'lowSeason':
                strategy = new LowSeasonStrategy();
                break;
            case 'loyaltyDiscount':
                strategy = new LoyaltyDiscountStrategy();
                break;
            default:
                return res.status(400).json({ error: 'Invalid strategy type' });
        }
        const priceContext = new PriceContext(strategy);
        res.json({ originalPrice: product.price, finalPrice: priceContext.calculatePrice(product.price) });
    });
};
```

## 6. Patrón Command: Operaciones de Inventario

**Descripción**: Realizar operaciones de inventario (añadir, actualizar, eliminar productos) y permitir deshacer/rehacer operaciones.

**Implementación**:

**Archivo**: `models/inventoryCommand.js`
```javascript
class Command {
    execute() {
        throw new Error('Method not implemented');
    }

    undo() {
        throw new Error('Method not implemented');
    }
}

class AddProductCommand extends Command {
    constructor(product, inventory) {
        super();
        this.product = product;
        this.inventory = inventory;
    }

    execute() {
        this.inventory.addProduct(this.product);
    }

    undo() {
        this.inventory.removeProduct(this.product);
    }
}

class RemoveProductCommand extends Command {
    constructor(product, inventory) {
        super();
        this.product = product;
        this.inventory = inventory;
    }

    execute() {
        this.inventory.removeProduct(this.product);
    }

    undo() {
        this.inventory.addProduct(this.product);
    }
}

class Inventory {
    constructor() {
        this.products = [];
    }

    addProduct(product) {
        this.products.push(product);
        console.log(`Product added: ${product.name}`);
    }

    removeProduct(product) {
        this.products = this.products.filter(p => p !== product);
        console.log(`Product removed: ${product.name}`);
    }

    listProducts() {
        return this.products;
    }
}

class InventoryManager {
    constructor() {
        this.commands = [];
    }

    executeCommand(command) {
        command.execute();
        this.commands.push(command);
    }

    undoCommand() {
        const command = this.commands.pop();
        if (command) {
            command.undo();
        }
    }
}

module.exports = { AddProductCommand, RemoveProductCommand, Inventory, InventoryManager };
```

**Aplicación en el Proyecto**:
- Actualiza el controlador para realizar operaciones de inventario utilizando comandos.
```javascript
const { AddProductCommand, RemoveProductCommand, Inventory, InventoryManager } = require('../models/inventoryCommand');

const inventory = new Inventory();
const manager = new InventoryManager();

const addProductToInventory = (req, res) => {
    const product = req.body;
    const addProductCommand = new AddProductCommand(product, inventory);
    manager.executeCommand(addProductCommand);
    res.json({ message: 'Product added to inventory', products: inventory.listProducts() });
};

const removeProductFromInventory = (req, res) => {
    const product = req.body;
    const removeProductCommand = new RemoveProductCommand(product, inventory);
    manager.executeCommand(removeProductCommand);
    res.json({ message: 'Product removed from inventory', products: inventory.listProducts() });
};

const undoLastCommand = (req, res) => {
    manager.undoCommand();
    res.json({ message: 'Last command undone', products: inventory.listProducts() });
};
```