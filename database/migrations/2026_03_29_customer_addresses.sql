CREATE TABLE IF NOT EXISTS customer_addresses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNSIGNED NOT NULL,
    label VARCHAR(80) NOT NULL,
    recipient_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) DEFAULT NULL,
    address_line VARCHAR(255) NOT NULL,
    reference VARCHAR(255) DEFAULT NULL,
    city VARCHAR(120) NOT NULL,
    province VARCHAR(120) DEFAULT NULL,
    is_default TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer_addresses_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    KEY idx_customer_addresses_customer (customer_id)
);
