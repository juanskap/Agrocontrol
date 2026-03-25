<?php

declare(strict_types=1);

spl_autoload_register(static function (string $class): void {
    $prefix = 'App\\';
    $baseDir = BASE_PATH . '/app/';

    if (strncmp($prefix, $class, strlen($prefix)) !== 0) {
        return;
    }

    $relativeClass = substr($class, strlen($prefix));
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

    if (is_file($file)) {
        require $file;
    }
});

require_once BASE_PATH . '/app/Core/helpers.php';

App\Core\Env::load(BASE_PATH . '/.env');

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_name((string) env('SESSION_NAME', 'agrocontrol_session'));
    session_start([
        'cookie_httponly' => true,
        'cookie_samesite' => 'Lax',
        'use_strict_mode' => true,
    ]);
}
