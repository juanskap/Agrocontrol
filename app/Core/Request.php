<?php

declare(strict_types=1);

namespace App\Core;

final class Request
{
    private ?array $jsonBody = null;

    public function method(): string
    {
        return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    }

    public function path(): string
    {
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $path = (string) parse_url($uri, PHP_URL_PATH);

        $baseUrl = rtrim((string) env('APP_BASE_URL', '/paginainventario'), '/');
        if ($baseUrl !== '' && $baseUrl !== '/' && str_starts_with($path, $baseUrl)) {
            $path = substr($path, strlen($baseUrl)) ?: '/';
        }

        return '/' . trim($path, '/');
    }

    public function json(): array
    {
        if ($this->jsonBody !== null) {
            return $this->jsonBody;
        }

        $raw = file_get_contents('php://input');
        if (($raw === false || trim($raw) === '') && PHP_SAPI === 'cli') {
            $raw = file_get_contents('php://stdin');
        }

        if ($raw === false || trim($raw) === '') {
            return $this->jsonBody = [];
        }

        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            return $this->jsonBody = [];
        }

        return $this->jsonBody = $decoded;
    }
}
