<?php

declare(strict_types=1);

namespace App\Core;

final class App
{
    private Router $router;

    public function __construct()
    {
        require_once BASE_PATH . '/app/Core/helpers.php';

        $this->router = new Router();
        $routes = require base_path('routes/web.php');
        $routes($this->router);
    }

    public function run(): void
    {
        $request = new Request();
        $this->router->dispatch($request);
    }
}
