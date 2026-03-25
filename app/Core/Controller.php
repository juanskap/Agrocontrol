<?php

declare(strict_types=1);

namespace App\Core;

class Controller
{
    protected function view(string $view, array $data = [], int $status = 200): void
    {
        $viewFile = base_path('app/Views/' . str_replace('.', '/', $view) . '.php');

        if (!is_file($viewFile)) {
            Response::send('View not found: ' . $viewFile, 500);
            return;
        }

        extract($data, EXTR_SKIP);
        ob_start();
        require $viewFile;
        $content = (string) ob_get_clean();

        Response::send($content, $status);
    }
}

