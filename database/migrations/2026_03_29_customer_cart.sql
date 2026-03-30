CREATE TABLE IF NOT EXISTS customer_carts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNSIGNED NOT NULL,
    status ENUM(''active'', ''converted'', ''abandoned'') NOT NULL DEFAULT ''active'',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer_carts_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    KEY idx_customer_carts_customer_status (customer_id, status)
);

CREATE TABLE IF NOT EXISTS customer_cart_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cart_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    is_selected TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer_cart_items_cart FOREIGN KEY (cart_id) REFERENCES customer_carts(id) ON DELETE CASCADE,
    CONSTRAINT fk_customer_cart_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_cart_product (cart_id, product_id)
);
