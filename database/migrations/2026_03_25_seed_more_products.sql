USE inventario_db;

INSERT INTO products (name, sku, category, presentation, price, stock, status, details_json)
VALUES
    ('Semilla arroz cristal', 'INS-002', 'insumos', 'Saco', 76, 18, 'active', '{"subcategory":"Semillas","unit":"und","content":"Saco de 20 kg","usage":"Lotes arroceros","notes":"Ficha base","status_label":"Disponible"}'),
    ('Semilla tomate saladette', 'INS-003', 'insumos', 'Sobre', 20, 15, 'active', '{"subcategory":"Semillas","unit":"und","content":"Sobre de 1000 semillas","usage":"Cultivo protegido","notes":"Ficha base","status_label":"Disponible"}'),
    ('Fungicida systemic max', 'INS-011', 'insumos', 'Botella', 18, 10, 'active', '{"subcategory":"Pesticidas","unit":"und","content":"Botella de 500 ml","usage":"Frutales y hortalizas","notes":"Ficha base","status_label":"Disponible"}'),
    ('Bioestimulante raiz pro', 'INS-019', 'insumos', 'Botella', 23, 9, 'active', '{"subcategory":"Complementos","unit":"und","content":"Botella de 1 litro","usage":"Etapa inicial","notes":"Ficha base","status_label":"Disponible"}'),
    ('Compost premium agro', 'ABO-001', 'abonos', 'Saco', 14, 22, 'active', '{"subcategory":"Organico","unit":"und","content":"Lote base 2026","usage":"Mejora de suelo","notes":"EcoCert","status_label":"Disponible"}'),
    ('Humus granulado plus', 'ABO-002', 'abonos', 'Saco', 20, 14, 'active', '{"subcategory":"Organico","unit":"und","content":"Lote base 2026","usage":"Viveros y hortalizas","notes":"Organico validado","status_label":"Disponible"}'),
    ('Urea tecnica', 'ABO-011', 'abonos', 'Saco', 24, 18, 'active', '{"subcategory":"Quimico","unit":"und","content":"Lote base 2026","usage":"Crecimiento vegetativo","notes":"Proveedor aprobado","status_label":"Disponible"}'),
    ('Silicio foliar', 'ABO-019', 'abonos', 'Botella', 24, 11, 'active', '{"subcategory":"Foliar","unit":"und","content":"Botella de 1 litro","usage":"Resistencia estructural","notes":"Proveedor tecnico","status_label":"Disponible"}'),
    ('Juego de palas reforzadas', 'HER-001', 'herramientas', 'Kit', 58, 6, 'active', '{"subcategory":"Manual","unit":"und","content":"Kit de 6 piezas","usage":"Herramienta base","notes":"Lista para asignacion","status_label":"Disponible"}'),
    ('Carretilla reforzada', 'HER-004', 'herramientas', 'Unidad', 78, 5, 'active', '{"subcategory":"Manual","unit":"und","content":"Capacidad de 90 litros","usage":"Herramienta base","notes":"Lista para asignacion","status_label":"Disponible"}'),
    ('Taladro industrial', 'HER-009', 'herramientas', 'Unidad', 118, 4, 'active', '{"subcategory":"Manual","unit":"und","content":"Potencia de 850 W","usage":"Herramienta base","notes":"Lista para asignacion","status_label":"Disponible"}'),
    ('Motobomba MX40', 'HER-020', 'herramientas', 'Maquina', 1250, 3, 'active', '{"subcategory":"Riego","unit":"und","content":"Caudal de 40 m3 por hora","usage":"Equipo base","notes":"Programar mantenimiento","status_label":"Disponible"}')
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    category = VALUES(category),
    presentation = VALUES(presentation),
    price = VALUES(price),
    stock = VALUES(stock),
    status = VALUES(status),
    details_json = VALUES(details_json);
