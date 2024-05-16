## Esquema de la Base de Datos

### Tabla `products`
Esta tabla almacenará la información básica de los productos en el inventario.
```sql
CREATE DATABASE IF NOT EXISTS inventory;

USE inventory;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabla `suppliers`
Esta tabla almacenará información sobre los proveedores de los productos.
```sql
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabla `orders`
Esta tabla almacenará las órdenes de compra realizadas.
```sql
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);
```

### Tabla `order_items`
Esta tabla almacenará los detalles de los productos en cada orden de compra.
```sql
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## Creación de la Base de Datos

Para crear la base de datos y las tablas, puedes ejecutar los scripts anteriores en tu cliente de MySQL. Si estás utilizando la línea de comandos, sigue estos pasos:

1. Abre la línea de comandos de MySQL:
   ```bash
   mysql -u root -p
   ```

2. Ejecuta los scripts SQL:
   ```sql
   -- Create database and tables
   CREATE DATABASE IF NOT EXISTS inventory;

   USE inventory;

   CREATE TABLE IF NOT EXISTS products (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       description TEXT,
       price DECIMAL(10, 2) NOT NULL,
       quantity INT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

   CREATE TABLE IF NOT EXISTS suppliers (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       contact_name VARCHAR(255),
       contact_email VARCHAR(255),
       contact_phone VARCHAR(50),
       address TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

   CREATE TABLE IF NOT EXISTS orders (
       id INT AUTO_INCREMENT PRIMARY KEY,
       supplier_id INT NOT NULL,
       order_date DATE NOT NULL,
       total_amount DECIMAL(10, 2) NOT NULL,
       status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
   );

   CREATE TABLE IF NOT EXISTS order_items (
       id INT AUTO_INCREMENT PRIMARY KEY,
       order_id INT NOT NULL,
       product_id INT NOT NULL,
       quantity INT NOT NULL,
       unit_price DECIMAL(10, 2) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       FOREIGN KEY (order_id) REFERENCES orders(id),
       FOREIGN KEY (product_id) REFERENCES products(id)
   );
   ```

Con esto, la base de datos y las tablas necesarias estarán configuradas.