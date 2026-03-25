<?php

declare(strict_types=1);

const BASE_PATH = __DIR__ . '/..';

require BASE_PATH . '/bootstrap/app.php';
require_once BASE_PATH . '/app/Core/helpers.php';

$host = env('DB_HOST', '127.0.0.1');
$port = env('DB_PORT', '3306');
$database = env('DB_DATABASE', 'inventario_db');
$username = env('DB_USERNAME', 'root');
$password = env('DB_PASSWORD', '');
$schemaPath = __DIR__ . '/schema.sql';

if (!is_file($schemaPath)) {
    fwrite(STDERR, "No se encontro database/schema.sql" . PHP_EOL);
    exit(1);
}

$dsn = sprintf('mysql:host=%s;port=%s;charset=utf8mb4', $host, $port);

try {
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    $sql = file_get_contents($schemaPath);
    if ($sql === false) {
        throw new RuntimeException('No se pudo leer el archivo schema.sql');
    }

    $pdo->exec($sql);

    fwrite(STDOUT, sprintf("Base de datos '%s' y tablas creadas correctamente.%s", $database, PHP_EOL));
} catch (Throwable $exception) {
    fwrite(STDERR, 'Error al inicializar la base de datos: ' . $exception->getMessage() . PHP_EOL);
    exit(1);
}
