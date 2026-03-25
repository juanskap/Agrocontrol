<?php

declare(strict_types=1);

use App\Controllers\ApiController;
use App\Controllers\InventoryController;
use App\Controllers\PageController;
use App\Core\Router;

return static function (Router $router): void {
    $router->get('/', [PageController::class, 'home']);
    $router->get('/index.html', [PageController::class, 'home']);

    $router->get('/nosotros', [PageController::class, 'about']);
    $router->get('/nosotros.html', [PageController::class, 'about']);

    $router->get('/inventario', [PageController::class, 'inventory']);
    $router->get('/inventario.html', [PageController::class, 'inventory']);

    $router->get('/movimientos', [PageController::class, 'movements']);
    $router->get('/movimientos.html', [PageController::class, 'movements']);

    $router->get('/contacto', [PageController::class, 'contact']);
    $router->get('/contacto.html', [PageController::class, 'contact']);

    $router->get('/login', [PageController::class, 'login']);
    $router->get('/login.html', [PageController::class, 'login']);

    $router->get('/pos', [PageController::class, 'pos']);
    $router->get('/pos.html', [PageController::class, 'pos']);

    $router->post('/api/login', [ApiController::class, 'login']);
    $router->post('/api/logout', [ApiController::class, 'logout']);
    $router->get('/api/session', [ApiController::class, 'session']);
    $router->get('/api/payment-methods', [ApiController::class, 'paymentMethods']);
    $router->get('/api/customers', [ApiController::class, 'customers']);
    $router->post('/api/customers', [ApiController::class, 'storeCustomer']);

    $router->get('/api/inventory-state', [InventoryController::class, 'inventoryState']);
    $router->get('/api/movements', [InventoryController::class, 'movements']);
    $router->get('/api/sales', [InventoryController::class, 'sales']);
    $router->post('/api/products', [InventoryController::class, 'storeProduct']);
    $router->post('/api/products/update', [InventoryController::class, 'updateProduct']);
    $router->post('/api/products/delete', [InventoryController::class, 'deleteProduct']);
    $router->post('/api/movements', [InventoryController::class, 'storeMovement']);
    $router->post('/api/sales', [ApiController::class, 'storeSale']);

    $router->get('/health', [PageController::class, 'health']);
};
