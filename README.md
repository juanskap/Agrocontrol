# Inventario MVC (PHP + MySQL)

## Requisitos
- XAMPP (Apache + MySQL)
- PHP 8.1 o superior

## Instalacion rapida
1. Copia `.env.example` a `.env`.
2. Ajusta credenciales de MySQL en `.env`.
3. Crea la base y tablas con una de estas opciones:
   - Instalacion limpia: importa `database/schema.sql`.
   - Consola: ejecuta `php database/init.php`.
4. Si ya tienes una base creada y quieres agregar POS + clientes + pagos, ejecuta `database/migrations/2026_03_25_pos_sales_upgrade.sql`.
5. Abre en navegador: `http://localhost/paginainventario/`.

## Estructura
- `public/index.php`: punto de entrada
- `app/Core`: nucleo (App, Router, Request, DB)
- `app/Controllers`: controladores
- `app/Views`: vistas
- `routes/web.php`: rutas web
- `database/schema.sql`: esquema inicial completo
- `database/migrations/2026_03_25_pos_sales_upgrade.sql`: upgrade para ventas POS
- `database/init.php`: inicializador CLI de base de datos

## Modelo POS
- `customers`: clientes obligatorios para registrar una venta
- `payment_methods`: catalogo de formas de pago
- `sales`: cabecera de venta
- `sale_items`: detalle por producto
- `movements`: salidas/entradas con referencia a venta cuando aplique

## API POS
- `GET /api/payment-methods`: lista formas de pago activas
- `GET /api/customers`: lista cuentas cliente activas
- `POST /api/customers`: crea una cuenta cliente desde el POS
- `POST /api/sales`: registra una venta detallada en MySQL

## Rutas
- `/` inicio
- `/nosotros` pagina institucional
- `/inventario` panel de inventario
- `/movimientos` panel de movimientos
- `/contacto` contacto
- `/login` acceso
- `/pos` punto de venta
- `/health` estado JSON

Compatibilidad:
- Tambien funcionan las rutas legacy `*.html` mientras termina la migracion.
