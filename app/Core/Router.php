<?php

declare(strict_types=1);

namespace App\Core;

final class Router
{
    private array $routes = [
        'GET' => [],
        'POST' => [],
    ];

    public function get(string $path, callable|array $handler): void
    {
        $this->addRoute('GET', $path, $handler);
    }

    public function post(string $path, callable|array $handler): void
    {
        $this->addRoute('POST', $path, $handler);
    }

    public function dispatch(Request $request): void
    {
        $method = $request->method();
        $path = $request->path();

        $handler = $this->routes[$method][$path] ?? null;

        if ($handler === null) {
            Response::send('404 - Ruta no encontrada', 404);
            return;
        }

        if (is_callable($handler)) {
            $handler($request);
            return;
        }

        [$controllerClass, $action] = $handler;
        $controller = new $controllerClass();
        $controller->$action($request);
    }

    private function addRoute(string $method, string $path, callable|array $handler): void
    {
        $normalizedPath = '/' . trim($path, '/');
        $this->routes[$method][$normalizedPath] = $handler;
    }
}
