<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use PDO;
use Throwable;

final class ApiController
{
    public function paymentMethods(): void
    {
        try {
            $pdo = Database::connection();
            $stmt = $pdo->query('SELECT id, code, name, requires_reference FROM payment_methods WHERE is_active = 1 ORDER BY id ASC');
            Response::json([
                'status' => 'ok',
                'data' => $stmt->fetchAll(),
            ]);
        } catch (Throwable $error) {
            $this->error('No se pudieron cargar las formas de pago.', 500);
        }
    }

    public function session(): void
    {
        Response::json([
            'status' => 'ok',
            'data' => Auth::user(),
        ]);
    }

    public function logout(): void
    {
        Auth::logout();

        Response::json([
            'status' => 'ok',
            'data' => null,
        ]);
    }

    public function customers(): void
    {
        if (!Auth::check()) {
            $this->error('Debes iniciar sesion para consultar clientes.', 401);
            return;
        }

        try {
            $pdo = Database::connection();

            if (Auth::isAdmin()) {
                $stmt = $pdo->query('SELECT id, code, full_name, email, phone FROM customers WHERE status = "active" ORDER BY id DESC LIMIT 200');
                $rows = $stmt->fetchAll();
            } else {
                $stmt = $pdo->prepare('SELECT id, code, full_name, email, phone FROM customers WHERE id = :id AND status = :status LIMIT 1');
                $stmt->execute([
                    'id' => Auth::id(),
                    'status' => 'active',
                ]);
                $row = $stmt->fetch();
                $rows = $row === false ? [] : [$row];
            }

            Response::json([
                'status' => 'ok',
                'data' => $rows,
            ]);
        } catch (Throwable $error) {
            $this->error('No se pudieron cargar los clientes.', 500);
        }
    }

    public function storeCustomer(Request $request): void
    {
        $payload = $request->json();
        $fullName = trim((string) ($payload['full_name'] ?? ''));
        $email = trim((string) ($payload['email'] ?? ''));
        $phone = trim((string) ($payload['phone'] ?? ''));
        $password = (string) ($payload['password'] ?? '');

        if ($fullName === '') {
            $this->error('El nombre del cliente es obligatorio.', 422);
            return;
        }

        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('El correo del cliente no es valido.', 422);
            return;
        }

        if (mb_strlen($password) < 6) {
            $this->error('La contrasena debe tener al menos 6 caracteres.', 422);
            return;
        }

        try {
            $pdo = Database::connection();

            $existing = $pdo->prepare('SELECT id FROM customers WHERE email = :email LIMIT 1');
            $existing->execute(['email' => $email]);
            if ($existing->fetch() !== false) {
                $this->error('Ya existe una cuenta con este correo.', 409);
                return;
            }

            $code = $this->nextCustomerCode($pdo);
            $documentNumber = 'WEB-' . strtoupper(substr(sha1($email . $fullName), 0, 12));
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $pdo->prepare('INSERT INTO customers (code, document_type, document_number, full_name, email, phone, password_hash, status) VALUES (:code, :document_type, :document_number, :full_name, :email, :phone, :password_hash, :status)');
            $stmt->execute([
                'code' => $code,
                'document_type' => 'otro',
                'document_number' => $documentNumber,
                'full_name' => $fullName,
                'email' => $email,
                'phone' => $phone !== '' ? $phone : null,
                'password_hash' => $passwordHash,
                'status' => 'active',
            ]);

            $customerId = (int) $pdo->lastInsertId();
            $session = Auth::login($this->buildSessionPayload('customer', $customerId, $fullName, $email));

            Response::json([
                'status' => 'ok',
                'data' => [
                    'id' => $customerId,
                    'code' => $code,
                    'full_name' => $fullName,
                    'email' => $email,
                    'phone' => $phone,
                    'session' => $session,
                ],
            ], 201);
        } catch (Throwable $error) {
            $this->error('No se pudo crear la cuenta del cliente.', 500);
        }
    }

    public function login(Request $request): void
    {
        $payload = $request->json();
        $identifier = trim((string) ($payload['identifier'] ?? ''));
        $password = (string) ($payload['password'] ?? '');

        if ($identifier === '' || $password === '') {
            $this->error('Debes ingresar tu correo y contrasena.', 422);
            return;
        }

        $adminUsername = (string) env('ADMIN_USERNAME', 'admin');
        $adminPassword = (string) env('ADMIN_PASSWORD', 'Agro2026.');

        if ($identifier === $adminUsername && $password === $adminPassword) {
            $session = Auth::login($this->buildSessionPayload('admin', 0, 'Administrador', $adminUsername));

            Response::json([
                'status' => 'ok',
                'data' => $session,
            ]);
            return;
        }

        try {
            $pdo = Database::connection();
            $stmt = $pdo->prepare('SELECT id, full_name, email, password_hash, status FROM customers WHERE email = :email LIMIT 1');
            $stmt->execute(['email' => $identifier]);
            $customer = $stmt->fetch();

            if ($customer === false || (string) ($customer['status'] ?? '') !== 'active') {
                $this->error('Usuario o contrasena incorrectos.', 401);
                return;
            }

            $hash = (string) ($customer['password_hash'] ?? '');
            if ($hash === '' || !password_verify($password, $hash)) {
                $this->error('Usuario o contrasena incorrectos.', 401);
                return;
            }

            $session = Auth::login($this->buildSessionPayload(
                'customer',
                (int) $customer['id'],
                (string) $customer['full_name'],
                (string) $customer['email']
            ));

            Response::json([
                'status' => 'ok',
                'data' => $session,
            ]);
        } catch (Throwable $error) {
            $this->error('No se pudo completar el inicio de sesion.', 500);
        }
    }

    public function storeSale(Request $request): void
    {
        $payload = $request->json();
        $customerId = (int) ($payload['customer_id'] ?? 0);
        $paymentCode = trim((string) ($payload['payment_code'] ?? ''));
        $note = trim((string) ($payload['note'] ?? ''));
        $discount = (float) ($payload['discount'] ?? 0);
        $items = is_array($payload['items'] ?? null) ? $payload['items'] : [];

        if (Auth::isCustomer()) {
            $customerId = Auth::id();
        }

        if ($customerId <= 0) {
            $this->error('Debes seleccionar un cliente valido.', 422);
            return;
        }

        if ($paymentCode === '') {
            $this->error('Debes seleccionar una forma de pago.', 422);
            return;
        }

        if ($items === []) {
            $this->error('La venta debe incluir al menos un producto.', 422);
            return;
        }

        $subtotal = 0.0;
        foreach ($items as $item) {
            $quantity = (int) ($item['quantity'] ?? 0);
            $unitPrice = (float) ($item['unit_price'] ?? 0);
            if ($quantity <= 0) {
                $this->error('Cada producto debe tener una cantidad valida.', 422);
                return;
            }
            $subtotal += $quantity * $unitPrice;
        }

        $total = max($subtotal - max($discount, 0), 0);

        try {
            $pdo = Database::connection();
            $pdo->beginTransaction();

            $customer = $pdo->prepare('SELECT id, full_name FROM customers WHERE id = :id LIMIT 1');
            $customer->execute(['id' => $customerId]);
            $customerRow = $customer->fetch();
            if ($customerRow === false) {
                $pdo->rollBack();
                $this->error('El cliente seleccionado no existe.', 404);
                return;
            }

            if (Auth::isCustomer() && (int) $customerRow['id'] !== Auth::id()) {
                $pdo->rollBack();
                $this->error('No puedes registrar ventas para otro cliente.', 403);
                return;
            }

            $payment = $pdo->prepare('SELECT id, code, name FROM payment_methods WHERE code = :code AND is_active = 1 LIMIT 1');
            $payment->execute(['code' => $paymentCode]);
            $paymentRow = $payment->fetch();
            if ($paymentRow === false) {
                $pdo->rollBack();
                $this->error('La forma de pago seleccionada no existe.', 404);
                return;
            }

            $saleNumber = $this->nextSaleNumber($pdo);
            $saleDate = date('Y-m-d H:i:s');

            $saleStmt = $pdo->prepare('INSERT INTO sales (sale_number, customer_id, payment_method_id, sale_date, subtotal, discount, total, note, status) VALUES (:sale_number, :customer_id, :payment_method_id, :sale_date, :subtotal, :discount, :total, :note, :status)');
            $saleStmt->execute([
                'sale_number' => $saleNumber,
                'customer_id' => $customerId,
                'payment_method_id' => (int) $paymentRow['id'],
                'sale_date' => $saleDate,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => $total,
                'note' => $note !== '' ? $note : null,
                'status' => 'completed',
            ]);

            $saleId = (int) $pdo->lastInsertId();

            foreach ($items as $item) {
                $productId = $this->resolveProductId($pdo, $item);
                $quantity = (int) ($item['quantity'] ?? 0);
                $unitPrice = (float) ($item['unit_price'] ?? 0);
                $lineSubtotal = $quantity * $unitPrice;
                $stockAfter = isset($item['stock_after']) ? (int) $item['stock_after'] : null;

                $saleItemStmt = $pdo->prepare('INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES (:sale_id, :product_id, :quantity, :unit_price, :subtotal)');
                $saleItemStmt->execute([
                    'sale_id' => $saleId,
                    'product_id' => $productId,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $lineSubtotal,
                ]);

                if ($stockAfter !== null) {
                    $stockStmt = $pdo->prepare('UPDATE products SET stock = :stock, price = :price WHERE id = :id');
                    $stockStmt->execute([
                        'stock' => $stockAfter,
                        'price' => $unitPrice,
                        'id' => $productId,
                    ]);
                }

                $movementStmt = $pdo->prepare('INSERT INTO movements (product_id, sale_id, customer_id, payment_method_id, type, reason, quantity, unit_cost, total_cost, note, responsible_name) VALUES (:product_id, :sale_id, :customer_id, :payment_method_id, :type, :reason, :quantity, :unit_cost, :total_cost, :note, :responsible_name)');
                $movementStmt->execute([
                    'product_id' => $productId,
                    'sale_id' => $saleId,
                    'customer_id' => $customerId,
                    'payment_method_id' => (int) $paymentRow['id'],
                    'type' => 'salida',
                    'reason' => 'venta',
                    'quantity' => $quantity,
                    'unit_cost' => $unitPrice,
                    'total_cost' => $lineSubtotal,
                    'note' => $note !== '' ? $note : 'Venta POS',
                    'responsible_name' => (string) $customerRow['full_name'],
                ]);
            }

            $pdo->commit();

            Response::json([
                'status' => 'ok',
                'data' => [
                    'sale_id' => $saleId,
                    'sale_number' => $saleNumber,
                    'customer_name' => (string) $customerRow['full_name'],
                    'payment_code' => (string) $paymentRow['code'],
                    'payment_name' => (string) $paymentRow['name'],
                    'subtotal' => $subtotal,
                    'discount' => $discount,
                    'total' => $total,
                ],
            ], 201);
        } catch (Throwable $error) {
            if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            $this->error('No se pudo registrar la venta.', 500);
        }
    }

    private function resolveProductId(PDO $pdo, array $item): int
    {
        $sku = trim((string) ($item['sku'] ?? $item['id'] ?? ''));
        $name = trim((string) ($item['name'] ?? 'Producto POS'));
        $category = trim((string) ($item['category'] ?? ''));
        $presentation = trim((string) ($item['presentation'] ?? ''));
        $price = (float) ($item['unit_price'] ?? 0);

        if ($sku === '') {
            throw new \RuntimeException('No se pudo resolver el SKU del producto.');
        }

        $findStmt = $pdo->prepare('SELECT id FROM products WHERE sku = :sku LIMIT 1');
        $findStmt->execute(['sku' => $sku]);
        $existing = $findStmt->fetchColumn();
        if ($existing !== false) {
            return (int) $existing;
        }

        $insertStmt = $pdo->prepare('INSERT INTO products (name, sku, category, presentation, price, stock, status) VALUES (:name, :sku, :category, :presentation, :price, :stock, :status)');
        $insertStmt->execute([
            'name' => $name,
            'sku' => $sku,
            'category' => $category !== '' ? $category : null,
            'presentation' => $presentation !== '' ? $presentation : null,
            'price' => $price,
            'stock' => 0,
            'status' => 'active',
        ]);

        return (int) $pdo->lastInsertId();
    }

    private function nextCustomerCode(PDO $pdo): string
    {
        $lastCode = (string) $pdo->query('SELECT code FROM customers ORDER BY id DESC LIMIT 1')->fetchColumn();
        $lastNumber = preg_match('/(\d+)$/', $lastCode, $matches) === 1 ? (int) $matches[1] : 0;
        return 'CLI-' . str_pad((string) ($lastNumber + 1), 4, '0', STR_PAD_LEFT);
    }

    private function nextSaleNumber(PDO $pdo): string
    {
        $count = (int) $pdo->query('SELECT COUNT(*) FROM sales')->fetchColumn();
        return 'VTA-' . date('Ymd') . '-' . str_pad((string) ($count + 1), 5, '0', STR_PAD_LEFT);
    }

    private function error(string $message, int $status = 400): void
    {
        Response::json([
            'status' => 'error',
            'message' => $message,
        ], $status);
    }

    private function buildSessionPayload(string $role, int $id, string $name, string $email): array
    {
        return [
            'role' => $role,
            'id' => $id,
            'user' => $name,
            'email' => $email,
            'loginAt' => date(DATE_ATOM),
        ];
    }
}

