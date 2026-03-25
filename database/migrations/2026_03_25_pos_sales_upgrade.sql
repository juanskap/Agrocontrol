USE inventario_db;

CREATE TABLE IF NOT EXISTS customers (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    document_type ENUM('cedula', 'ruc', 'pasaporte', 'otro') NOT NULL DEFAULT 'cedula',
    document_number VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) DEFAULT NULL,
    password_hash VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(30) DEFAULT NULL,
    address VARCHAR(255) DEFAULT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_methods (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(80) NOT NULL,
    requires_reference TINYINT(1) NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sale_number VARCHAR(30) NOT NULL UNIQUE,
    customer_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED DEFAULT NULL,
    payment_method_id INT UNSIGNED NOT NULL,
    sale_date DATETIME NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount DECIMAL(12,2) NOT NULL DEFAULT 0,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    note VARCHAR(255) DEFAULT NULL,
    status ENUM('completed', 'cancelled') NOT NULL DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sales_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_sales_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_sales_payment_method FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
);

CREATE TABLE IF NOT EXISTS sale_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sale_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sale_items_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    CONSTRAINT fk_sale_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

ALTER TABLE customers ADD COLUMN password_hash VARCHAR(255) NULL AFTER email;
ALTER TABLE products ADD COLUMN category VARCHAR(80) NULL AFTER sku;
ALTER TABLE products ADD COLUMN presentation VARCHAR(120) NULL AFTER category;
ALTER TABLE products ADD COLUMN status ENUM('active', 'inactive') NOT NULL DEFAULT 'active' AFTER stock;
ALTER TABLE movements ADD COLUMN sale_id INT UNSIGNED NULL AFTER product_id;
ALTER TABLE movements ADD COLUMN customer_id INT UNSIGNED NULL AFTER sale_id;
ALTER TABLE movements ADD COLUMN payment_method_id INT UNSIGNED NULL AFTER customer_id;
ALTER TABLE movements ADD COLUMN reason ENUM('compra', 'venta', 'devolucion', 'ajuste', 'merma') NOT NULL DEFAULT 'ajuste' AFTER type;
ALTER TABLE movements ADD COLUMN unit_cost DECIMAL(10,2) NULL AFTER quantity;
ALTER TABLE movements ADD COLUMN total_cost DECIMAL(12,2) NULL AFTER unit_cost;
ALTER TABLE movements ADD COLUMN responsible_name VARCHAR(150) NULL AFTER note;

ALTER TABLE movements MODIFY COLUMN type ENUM('entrada', 'salida', 'ajuste') NOT NULL;

ALTER TABLE movements
    ADD CONSTRAINT fk_movements_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_movements_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_movements_payment_method FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL;

INSERT INTO payment_methods (code, name, requires_reference, is_active)
VALUES
    ('cash', 'Efectivo', 0, 1),
    ('cards', 'Tarjetas', 1, 1),
    ('paypal', 'PayPal', 1, 1),
    ('transfer', 'Transferencia', 1, 1)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    requires_reference = VALUES(requires_reference),
    is_active = VALUES(is_active);
