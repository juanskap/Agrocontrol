<?php

declare(strict_types=1);

if (!function_exists('base_path')) {
    function base_path(string $path = ''): string
    {
        return BASE_PATH . ($path !== '' ? '/' . ltrim($path, '/') : '');
    }
}

if (!function_exists('env')) {
    function env(string $key, ?string $default = null): ?string
    {
        $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);

        if ($value === false || $value === null || $value === '') {
            return $default;
        }

        return (string) $value;
    }
}

if (!function_exists('app_url')) {
    function app_url(string $path = '/'): string
    {
        $baseUrl = rtrim((string) env('APP_BASE_URL', '/paginainventario'), '/');
        $normalizedPath = '/' . ltrim($path, '/');

        if ($baseUrl === '' || $baseUrl === '/') {
            return $normalizedPath;
        }

        return $baseUrl . ($normalizedPath === '/' ? '' : $normalizedPath);
    }
}
