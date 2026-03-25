<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use Throwable;

final class HomeController extends Controller
{
    public function index(Request $request): void
    {
        $dbStatus = 'No verificada';

        try {
            $pdo = Database::connection();
            $pdo->query('SELECT 1');
            $dbStatus = 'Conexion OK';
        } catch (Throwable $error) {
            $dbStatus = 'Error: ' . $error->getMessage();
        }

        $this->view('home.index', [
            'appName' => env('APP_NAME', 'Inventario MVC'),
            'dbStatus' => $dbStatus,
            'path' => $request->path(),
        ]);
    }

    public function health(): void
    {
        Response::json([
            'status' => 'ok',
            'app' => env('APP_NAME', 'Inventario MVC'),
        ]);
    }
}

