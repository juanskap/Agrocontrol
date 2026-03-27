<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Controller;
use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use Throwable;

final class PageController extends Controller
{
    private const PAGES = [
        'home' => 'index.html',
        'about' => 'nosotros.html',
        'inventory' => 'inventario.html',
        'movements' => 'movimientos.html',
        'contact' => 'contacto.html',
        'login' => 'login.html',
        'pos' => 'pos.html',
    ];

    public function home(Request $request): void
    {
        $dbStatus = 'No verificada';

        try {
            $pdo = Database::connection();
            $pdo->query('SELECT 1');
            $dbStatus = 'Conexion OK';
        } catch (Throwable $error) {
            $dbStatus = 'Error de conexion';
        }

        $this->renderStaticPage('home', [
            'appName' => env('APP_NAME', 'Inventario MVC'),
            'dbStatus' => $dbStatus,
            'path' => $request->path(),
        ]);
    }

    public function about(): void
    {
        $this->renderStaticPage('about');
    }

    public function inventory(): void
    {
        if ($this->requireAdminPage('/inventario')) {
            return;
        }

        $this->renderStaticPage('inventory');
    }

    public function movements(): void
    {
        if ($this->requireAdminPage('/movimientos')) {
            return;
        }

        $this->renderStaticPage('movements');
    }

    public function contact(): void
    {
        $this->renderStaticPage('contact');
    }

    public function login(): void
    {
        if (Auth::isAdmin()) {
            Response::redirect(app_url('/inventario.html'));
            return;
        }

        if (Auth::isCustomer()) {
            Response::redirect(app_url('/pos.html'));
            return;
        }

        $this->renderStaticPage('login');
    }

    public function pos(): void
    {
        $this->renderStaticPage('pos');
    }

    public function health(): void
    {
        Response::json([
            'status' => 'ok',
            'app' => env('APP_NAME', 'Inventario MVC'),
        ]);
    }

    private function requireAdminPage(string $path): bool
    {
        if (!Auth::check()) {
            $target = str_ends_with($path, '.html') ? $path : $path . '.html';
            Response::redirect(app_url('/login.html?redirect=' . urlencode($target)));
            return true;
        }

        if (!Auth::isAdmin()) {
            Response::redirect(app_url('/pos.html'));
            return true;
        }

        return false;
    }

    private function renderStaticPage(string $pageKey, array $extraData = []): void
    {
        $file = self::PAGES[$pageKey] ?? null;

        if ($file === null) {
            Response::send('404 - Pagina no encontrada', 404);
            return;
        }

        $htmlPath = base_path($file);
        if (!is_file($htmlPath)) {
            Response::send('500 - Archivo HTML no encontrado: ' . $file, 500);
            return;
        }

        $html = (string) file_get_contents($htmlPath);

        if ($html === '') {
            Response::send('500 - No se pudo cargar la pagina: ' . $file, 500);
            return;
        }

        $replacements = [
            'index.html' => '/index.html',
            'nosotros.html' => '/nosotros.html',
            'inventario.html' => '/inventario.html',
            'movimientos.html' => '/movimientos.html',
            'contacto.html' => '/contacto.html',
            'login.html' => '/login.html',
            'pos.html' => '/pos.html',
        ];

        $html = str_replace(array_keys($replacements), array_values($replacements), $html);

        foreach ($extraData as $key => $value) {
            $placeholder = '{{' . $key . '}}';
            $html = str_replace($placeholder, (string) $value, $html);
        }

        Response::send($html);
    }
}