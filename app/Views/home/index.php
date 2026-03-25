<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($appName ?? 'Inventario MVC', ENT_QUOTES, 'UTF-8') ?></title>
    <style>
        body { font-family: Arial, sans-serif; margin: 2rem; background: #f4f7fb; color: #1f2937; }
        .card { background: #ffffff; border-radius: 10px; padding: 1.25rem; box-shadow: 0 8px 30px rgba(0,0,0,.06); max-width: 760px; }
        h1 { margin-top: 0; }
        code { background: #eef2ff; padding: .1rem .35rem; border-radius: 6px; }
    </style>
</head>
<body>
    <main class="card">
        <h1><?= htmlspecialchars($appName ?? 'Inventario MVC', ENT_QUOTES, 'UTF-8') ?></h1>
        <p>Proyecto base en <strong>PHP + MVC</strong> listo.</p>
        <p><strong>Ruta actual:</strong> <code><?= htmlspecialchars($path ?? '/', ENT_QUOTES, 'UTF-8') ?></code></p>
        <p><strong>Base de datos:</strong> <?= htmlspecialchars($dbStatus ?? 'No verificada', ENT_QUOTES, 'UTF-8') ?></p>
        <p>Prueba JSON en <code>/health</code>.</p>
    </main>
</body>
</html>
