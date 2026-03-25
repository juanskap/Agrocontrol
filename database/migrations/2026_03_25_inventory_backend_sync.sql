USE inventario_db;

ALTER TABLE products ADD COLUMN IF NOT EXISTS details_json LONGTEXT NULL AFTER status;
ALTER TABLE movements ADD COLUMN IF NOT EXISTS meta_json LONGTEXT NULL AFTER responsible_name;
