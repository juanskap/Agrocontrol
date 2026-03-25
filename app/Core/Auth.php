<?php

declare(strict_types=1);

namespace App\Core;

final class Auth
{
    private const SESSION_KEY = 'auth_user';

    public static function user(): ?array
    {
        $user = $_SESSION[self::SESSION_KEY] ?? null;

        return is_array($user) ? $user : null;
    }

    public static function check(): bool
    {
        return self::user() !== null;
    }

    public static function id(): int
    {
        return (int) (self::user()['id'] ?? 0);
    }

    public static function role(): ?string
    {
        $role = self::user()['role'] ?? null;

        return is_string($role) && $role !== '' ? $role : null;
    }

    public static function isAdmin(): bool
    {
        return self::role() === 'admin';
    }

    public static function isCustomer(): bool
    {
        return self::role() === 'customer';
    }

    public static function login(array $session): array
    {
        $payload = [
            'role' => (string) ($session['role'] ?? ''),
            'id' => (int) ($session['id'] ?? 0),
            'user' => (string) ($session['user'] ?? ''),
            'email' => (string) ($session['email'] ?? ''),
            'loginAt' => (string) ($session['loginAt'] ?? date(DATE_ATOM)),
        ];

        $_SESSION[self::SESSION_KEY] = $payload;
        session_regenerate_id(true);

        return $payload;
    }

    public static function logout(): void
    {
        unset($_SESSION[self::SESSION_KEY]);

        if (session_status() !== PHP_SESSION_ACTIVE) {
            return;
        }

        session_regenerate_id(true);
    }
}
