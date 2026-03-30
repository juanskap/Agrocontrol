<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use PDO;
use RuntimeException;
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

        $adminUsername = trim((string) env('ADMIN_USERNAME', ''));
        $adminPassword = (string) env('ADMIN_PASSWORD', '');

        if ($adminUsername !== '' && $adminPassword !== '' && $identifier === $adminUsername && $password === $adminPassword) {
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

    public function favorites(): void
    {
        if (!Auth::isCustomer()) {
            $this->error('Debes iniciar sesion como cliente para consultar favoritos.', 403);
            return;
        }

        try {
            $pdo = Database::connection();
            $this->ensureFavoritesTable($pdo);

            $stmt = $pdo->prepare('
                SELECT
                    cf.id AS favorite_id,
                    cf.created_at,
                    p.id AS product_id,
                    p.sku,
                    p.name,
                    p.category,
                    p.presentation,
                    p.price,
                    p.stock,
                    p.status
                FROM customer_favorites cf
                INNER JOIN products p ON p.id = cf.product_id
                WHERE cf.customer_id = :customer_id
                ORDER BY cf.created_at DESC, cf.id DESC
            ');
            $stmt->execute([
                'customer_id' => Auth::id(),
            ]);

            $rows = array_map(fn (array $row): array => $this->favoriteRowPayload($row), $stmt->fetchAll());

            Response::json([
                'status' => 'ok',
                'data' => $rows,
            ]);
        } catch (Throwable $error) {
            $this->error('No se pudieron cargar los favoritos.', 500);
        }
    }

    public function storeFavorite(Request $request): void
    {
        if (!Auth::isCustomer()) {
            $this->error('Debes iniciar sesion como cliente para guardar favoritos.', 403);
            return;
        }

        $payload = $request->json();
        $sku = trim((string) ($payload['sku'] ?? $payload['id'] ?? ''));

        if ($sku === '') {
            $this->error('Debes indicar un producto valido.', 422);
            return;
        }

        try {
            $pdo = Database::connection();
            $this->ensureFavoritesTable($pdo);
            $product = $this->findProductBySku($pdo, $sku);

            if ($product === null) {
                $this->error('El producto seleccionado no existe.', 404);
                return;
            }

            $stmt = $pdo->prepare('INSERT IGNORE INTO customer_favorites (customer_id, product_id) VALUES (:customer_id, :product_id)');
            $stmt->execute([
                'customer_id' => Auth::id(),
                'product_id' => (int) $product['product_id'],
            ]);

            Response::json([
                'status' => 'ok',
                'data' => $this->favoriteRowPayload($product),
            ], 201);
        } catch (Throwable $error) {
            $this->error('No se pudo guardar el favorito.', 500);
        }
    }

    public function deleteFavorite(Request $request): void
    {
        if (!Auth::isCustomer()) {
            $this->error('Debes iniciar sesion como cliente para quitar favoritos.', 403);
            return;
        }

        $payload = $request->json();
        $sku = trim((string) ($payload['sku'] ?? $payload['id'] ?? ''));

        if ($sku === '') {
            $this->error('Debes indicar un producto valido.', 422);
            return;
        }

        try {
            $pdo = Database::connection();
            $this->ensureFavoritesTable($pdo);
            $product = $this->findProductBySku($pdo, $sku);

            if ($product === null) {
                $this->error('El producto seleccionado no existe.', 404);
                return;
            }

            $stmt = $pdo->prepare('DELETE FROM customer_favorites WHERE customer_id = :customer_id AND product_id = :product_id');
            $stmt->execute([
                'customer_id' => Auth::id(),
                'product_id' => (int) $product['product_id'],
            ]);

            Response::json([
                'status' => 'ok',
                'data' => [
                    'sku' => (string) $product['sku'],
                    'removed' => true,
                ],
            ]);
        } catch (Throwable $error) {
            $this->error('No se pudo quitar el favorito.', 500);
        }
    }
    public function cart(): void
    {
        if (!Auth::isCustomer()) {
            $this->error('Debes iniciar sesion como cliente para consultar el carrito.', 403);
            return;
        }

        try {
            $pdo = Database::connection();
            $this->ensureCartTables($pdo);

            Response::json([
                'status' => 'ok',
                'data' => $this->getActiveCartPayload($pdo, Auth::id()),
            ]);
        } catch (Throwable $error) {
            $this->error('No se pudo cargar el carrito.', 500);
        }
    }

    public function syncCart(Request $request): void
    {
        if (!Auth::isCustomer()) {
            $this->error('Debes iniciar sesion como cliente para guardar el carrito.', 403);
            return;
        }

        $payload = $request->json();
        $items = is_array($payload['items'] ?? null) ? $payload['items'] : [];

        try {
            $pdo = Database::connection();
            $this->ensureCartTables($pdo);
            $pdo->beginTransaction();

            $cartId = $this->getOrCreateActiveCartId($pdo, Auth::id());
            $pdo->prepare('DELETE FROM customer_cart_items WHERE cart_id = :cart_id')->execute(['cart_id' => $cartId]);

            if ($items !== []) {
                $insertStmt = $pdo->prepare('INSERT INTO customer_cart_items (cart_id, product_id, quantity, unit_price, is_selected) VALUES (:cart_id, :product_id, :quantity, :unit_price, :is_selected)');
                foreach ($items as $item) {
                    $sku = trim((string) ($item['sku'] ?? $item['id'] ?? ''));
                    $quantity = max(0, (int) ($item['quantity'] ?? 0));
                    $selected = !empty($item['selected']);

                    if ($sku === '' || $quantity <= 0) {
                        continue;
                    }

                    $product = $this->findProductBySku($pdo, $sku);
                    if ($product === null) {
                        continue;
                    }

                    $insertStmt->execute([
                        'cart_id' => $cartId,
                        'product_id' => (int) $product['product_id'],
                        'quantity' => $quantity,
                        'unit_price' => (float) $product['price'],
                        'is_selected' => $selected ? 1 : 0,
                    ]);
                }
            }

            $pdo->prepare('UPDATE customer_carts SET updated_at = CURRENT_TIMESTAMP WHERE id = :id')->execute(['id' => $cartId]);
            $pdo->commit();

            Response::json([
                'status' => 'ok',
                'data' => $this->getActiveCartPayload($pdo, Auth::id()),
            ]);
        } catch (Throwable $error) {
            if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            $this->error('No se pudo guardar el carrito.', 500);
        }
    }

    public function clearCart(): void
    {
        if (!Auth::isCustomer()) {
            $this->error('Debes iniciar sesion como cliente para limpiar el carrito.', 403);
            return;
        }

        try {
            $pdo = Database::connection();
            $this->ensureCartTables($pdo);
            $cartId = $this->findActiveCartId($pdo, Auth::id());
            if ($cartId !== null) {
                $pdo->prepare('DELETE FROM customer_cart_items WHERE cart_id = :cart_id')->execute(['cart_id' => $cartId]);
                $pdo->prepare('UPDATE customer_carts SET updated_at = CURRENT_TIMESTAMP WHERE id = :id')->execute(['id' => $cartId]);
            }

            Response::json([
                'status' => 'ok',
                'data' => [
                    'cart_id' => $cartId,
                    'items' => [],
                ],
            ]);
        } catch (Throwable $error) {
            $this->error('No se pudo limpiar el carrito.', 500);
        }
    }
    public function addresses(): void
    {
        if (!Auth::isCustomer()) {
            $this->error('Debes iniciar sesion como cliente para consultar direcciones.', 403);
            return;
        }

        try {
            $pdo = Database::connection();
            $this->ensureAddressesTable($pdo);

            Response::json([
                'status' => 'ok',
                'data' => $this->getCustomerAddresses($pdo, Auth::id()),
            ]);
        } catch (Throwable $error) {
            $this->error('No se pudieron cargar las direcciones.', 500);
        }
    }

    public function storeAddress(Request $request): void
    {
        if (!Auth::isCustomer()) {
            $this->error('Debes iniciar sesion como cliente para guardar direcciones.', 403);
            return;
        }

        $payload = $request->json();
        $data = $this->normalizeAddressPayload($payload);
        if ($data === null) {
            return;
        }

        try {
            $pdo = Database::connection();
            $this->ensureAddressesTable($pdo);

            $countStmt = $pdo->prepare('SELECT COUNT(*) FROM customer_addresses WHERE customer_id = :customer_id');
            $countStmt->execute(['customer_id' => Auth::id()]);
            if ((int) $countStmt->fetchColumn() >= 3) {
                $this->error('Solo puedes guardar hasta 3 direcciones.', 422);
                return;
            }

            $pdo->beginTransaction();
            if ($data['is_default']) {
                $pdo->prepare('UPDATE customer_addresses SET is_default = 0 WHERE customer_id = :customer_id')->execute(['customer_id' => Auth::id()]);
            }

            $stmt = $pdo->prepare('INSERT INTO customer_addresses (customer_id, label, recipient_name, phone, address_line, reference, city, province, is_default) VALUES (:customer_id, :label, :recipient_name, :phone, :address_line, :reference, :city, :province, :is_default)');
            $stmt->execute([
                'customer_id' => Auth::id(),
                'label' => $data['label'],
                'recipient_name' => $data['recipient_name'],
                'phone' => $data['phone'],
                'address_line' => $data['address_line'],
                'reference' => $data['reference'],
                'city' => $data['city'],
                'province' => $data['province'],
                'is_default' => $data['is_default'] ? 1 : 0,
            ]);

            $pdo->commit();

            Response::json([
                'status' => 'ok',
                'data' => $this->getCustomerAddresses($pdo, Auth::id()),
            ], 201);
        } catch (Throwable $error) {
            if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            $this->error('No se pudo guardar la direccion.', 500);
        }
    }

    public function updateAddress(Request $request): void
    {
        if (!Auth::isCustomer()) {
            $this->error('Debes iniciar sesion como cliente para actualizar direcciones.', 403);
            return;
        }

        $payload = $request->json();
        $addressId = (int) ($payload['id'] ?? 0);
        if ($addressId <= 0) {
            $this->error('Debes indicar una direccion valida.', 422);
            return;
        }

        $data = $this->normalizeAddressPayload($payload, false);
        $setDefaultOnly = !is_array($data) && !empty($payload['set_default']);
        if ($data === null && !$setDefaultOnly) {
            return;
        }

        try {
            $pdo = Database::connection();
            $this->ensureAddressesTable($pdo);
            $pdo->beginTransaction();

            $ownerStmt = $pdo->prepare('SELECT id FROM customer_addresses WHERE id = :id AND customer_id = :customer_id LIMIT 1');
            $ownerStmt->execute(['id' => $addressId, 'customer_id' => Auth::id()]);
            if ($ownerStmt->fetch() === false) {
                $pdo->rollBack();
                $this->error('La direccion indicada no existe.', 404);
                return;
            }

            if ($setDefaultOnly || ($data['is_default'] ?? false)) {
                $pdo->prepare('UPDATE customer_addresses SET is_default = 0 WHERE customer_id = :customer_id')->execute(['customer_id' => Auth::id()]);
            }

            if ($setDefaultOnly) {
                $pdo->prepare('UPDATE customer_addresses SET is_default = 1, updated_at = CURRENT_TIMESTAMP WHERE id = :id')->execute(['id' => $addressId]);
            } else {
                $stmt = $pdo->prepare('UPDATE customer_addresses SET label = :label, recipient_name = :recipient_name, phone = :phone, address_line = :address_line, reference = :reference, city = :city, province = :province, is_default = :is_default, updated_at = CURRENT_TIMESTAMP WHERE id = :id AND customer_id = :customer_id');
                $stmt->execute([
                    'id' => $addressId,
                    'customer_id' => Auth::id(),
                    'label' => $data['label'],
                    'recipient_name' => $data['recipient_name'],
                    'phone' => $data['phone'],
                    'address_line' => $data['address_line'],
                    'reference' => $data['reference'],
                    'city' => $data['city'],
                    'province' => $data['province'],
                    'is_default' => $data['is_default'] ? 1 : 0,
                ]);
            }

            $pdo->commit();

            Response::json([
                'status' => 'ok',
                'data' => $this->getCustomerAddresses($pdo, Auth::id()),
            ]);
        } catch (Throwable $error) {
            if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            $this->error('No se pudo actualizar la direccion.', 500);
        }
    }

    public function deleteAddress(Request $request): void
    {
        if (!Auth::isCustomer()) {
            $this->error('Debes iniciar sesion como cliente para eliminar direcciones.', 403);
            return;
        }

        $payload = $request->json();
        $addressId = (int) ($payload['id'] ?? 0);
        if ($addressId <= 0) {
            $this->error('Debes indicar una direccion valida.', 422);
            return;
        }

        try {
            $pdo = Database::connection();
            $this->ensureAddressesTable($pdo);
            $stmt = $pdo->prepare('DELETE FROM customer_addresses WHERE id = :id AND customer_id = :customer_id');
            $stmt->execute([
                'id' => $addressId,
                'customer_id' => Auth::id(),
            ]);

            Response::json([
                'status' => 'ok',
                'data' => $this->getCustomerAddresses($pdo, Auth::id()),
            ]);
        } catch (Throwable $error) {
            $this->error('No se pudo eliminar la direccion.', 500);
        }
    }
    public function storeSale(Request $request): void
    {
        $payload = $request->json();
        $customerId = (int) ($payload['customer_id'] ?? 0);
        $paymentCode = trim((string) ($payload['payment_code'] ?? ''));
        $note = trim((string) ($payload['note'] ?? ''));
        $shippingAddress = is_array($payload['shipping_address'] ?? null) ? $payload['shipping_address'] : [];
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

        $shippingAddressNote = $this->formatShippingAddressNote($shippingAddress);
        $noteForSale = trim(implode(' | ', array_filter([$note, $shippingAddressNote])));

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

            $saleItems = [];
            $subtotal = 0.0;
            foreach ($items as $item) {
                $sku = trim((string) ($item['sku'] ?? $item['id'] ?? ''));
                $quantity = (int) ($item['quantity'] ?? 0);

                if ($sku === '' || $quantity <= 0) {
                    $pdo->rollBack();
                    $this->error('Cada producto debe tener un SKU y una cantidad validos.', 422);
                    return;
                }

                $product = $this->findSaleProduct($pdo, $sku);
                if ($product === null) {
                    $pdo->rollBack();
                    $this->error(sprintf('El producto %s no existe.', $sku), 404);
                    return;
                }

                $currentStock = (int) ($product['stock'] ?? 0);
                if ($currentStock < $quantity) {
                    $pdo->rollBack();
                    $this->error(sprintf('Stock insuficiente para %s.', (string) ($product['sku'] ?? $sku)), 422);
                    return;
                }

                $unitPrice = (float) ($product['price'] ?? 0);
                $lineSubtotal = $quantity * $unitPrice;
                $subtotal += $lineSubtotal;

                $saleItems[] = [
                    'product_id' => (int) $product['id'],
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'line_subtotal' => $lineSubtotal,
                    'stock_after' => $currentStock - $quantity,
                ];
            }

            $discount = max($discount, 0);
            $total = max($subtotal - $discount, 0);
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
                'note' => $noteForSale !== '' ? $noteForSale : null,
                'status' => 'completed',
            ]);

            $saleId = (int) $pdo->lastInsertId();

            foreach ($saleItems as $item) {
                $saleItemStmt = $pdo->prepare('INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES (:sale_id, :product_id, :quantity, :unit_price, :subtotal)');
                $saleItemStmt->execute([
                    'sale_id' => $saleId,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['line_subtotal'],
                ]);

                $stockStmt = $pdo->prepare('UPDATE products SET stock = :stock WHERE id = :id');
                $stockStmt->execute([
                    'stock' => $item['stock_after'],
                    'id' => $item['product_id'],
                ]);

                $movementStmt = $pdo->prepare('INSERT INTO movements (product_id, sale_id, customer_id, payment_method_id, type, reason, quantity, unit_cost, total_cost, note, responsible_name) VALUES (:product_id, :sale_id, :customer_id, :payment_method_id, :type, :reason, :quantity, :unit_cost, :total_cost, :note, :responsible_name)');
                $movementStmt->execute([
                    'product_id' => $item['product_id'],
                    'sale_id' => $saleId,
                    'customer_id' => $customerId,
                    'payment_method_id' => (int) $paymentRow['id'],
                    'type' => 'salida',
                    'reason' => 'venta',
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_price'],
                    'total_cost' => $item['line_subtotal'],
                    'note' => $noteForSale !== '' ? $noteForSale : 'Venta POS',
                    'responsible_name' => (string) $customerRow['full_name'],
                ]);
            }

            $pdo->commit();

            if (Auth::isCustomer()) {
                $this->ensureCartTables($pdo);
                $activeCartId = $this->findActiveCartId($pdo, Auth::id());
                if ($activeCartId !== null) {
                    $pdo->prepare('DELETE FROM customer_cart_items WHERE cart_id = :cart_id AND is_selected = 1')->execute(['cart_id' => $activeCartId]);
                    $pdo->prepare('UPDATE customer_carts SET updated_at = CURRENT_TIMESTAMP WHERE id = :id')->execute(['id' => $activeCartId]);
                }
            }

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

    private function findSaleProduct(PDO $pdo, string $sku): ?array
    {
        if ($sku === '') {
            throw new RuntimeException('No se pudo resolver el SKU del producto.');
        }

        $findStmt = $pdo->prepare('SELECT id, sku, price, stock, status FROM products WHERE sku = :sku LIMIT 1');
        $findStmt->execute(['sku' => $sku]);
        $product = $findStmt->fetch();
        if ($product === false) {
            return null;
        }

        if ((string) ($product['status'] ?? '') !== 'active') {
            return null;
        }

        return $product;
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

    private function ensureFavoritesTable(PDO $pdo): void
    {
        $pdo->exec('
            CREATE TABLE IF NOT EXISTS customer_favorites (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                customer_id INT UNSIGNED NOT NULL,
                product_id INT UNSIGNED NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_customer_favorites_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
                CONSTRAINT fk_customer_favorites_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                UNIQUE KEY uniq_customer_product (customer_id, product_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ');
    }

    private function findProductBySku(PDO $pdo, string $sku): ?array
    {
        $stmt = $pdo->prepare('
            SELECT
                p.id AS product_id,
                p.sku,
                p.name,
                p.category,
                p.presentation,
                p.price,
                p.stock,
                p.status,
                NULL AS favorite_id,
                NULL AS created_at
            FROM products p
            WHERE p.sku = :sku
            LIMIT 1
        ');
        $stmt->execute(['sku' => $sku]);
        $row = $stmt->fetch();

        return $row === false ? null : $row;
    }

    private function favoriteRowPayload(array $row): array
    {
        return [
            'favorite_id' => isset($row['favorite_id']) ? (int) $row['favorite_id'] : null,
            'product_id' => (int) ($row['product_id'] ?? 0),
            'sku' => (string) ($row['sku'] ?? ''),
            'id' => (string) ($row['sku'] ?? ''),
            'name' => (string) ($row['name'] ?? 'Producto'),
            'category' => (string) ($row['category'] ?? ''),
            'presentation' => (string) ($row['presentation'] ?? ''),
            'price' => (float) ($row['price'] ?? 0),
            'stock' => (int) ($row['stock'] ?? 0),
            'status' => (string) ($row['status'] ?? 'active'),
            'created_at' => isset($row['created_at']) ? (string) $row['created_at'] : null,
        ];
    }
    private function ensureCartTables(PDO $pdo): void
    {
        $pdo->exec('
            CREATE TABLE IF NOT EXISTS customer_carts (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                customer_id INT UNSIGNED NOT NULL,
                status ENUM("active", "converted", "abandoned") NOT NULL DEFAULT "active",
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT fk_customer_carts_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
                KEY idx_customer_carts_customer_status (customer_id, status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ');

        $pdo->exec('
            CREATE TABLE IF NOT EXISTS customer_cart_items (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                cart_id INT UNSIGNED NOT NULL,
                product_id INT UNSIGNED NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
                is_selected TINYINT(1) NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT fk_customer_cart_items_cart FOREIGN KEY (cart_id) REFERENCES customer_carts(id) ON DELETE CASCADE,
                CONSTRAINT fk_customer_cart_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                UNIQUE KEY uniq_cart_product (cart_id, product_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ');
    }

    private function findActiveCartId(PDO $pdo, int $customerId): ?int
    {
        $stmt = $pdo->prepare('SELECT id FROM customer_carts WHERE customer_id = :customer_id AND status = :status ORDER BY id DESC LIMIT 1');
        $stmt->execute([
            'customer_id' => $customerId,
            'status' => 'active',
        ]);
        $cartId = $stmt->fetchColumn();

        return $cartId === false ? null : (int) $cartId;
    }

    private function getOrCreateActiveCartId(PDO $pdo, int $customerId): int
    {
        $existing = $this->findActiveCartId($pdo, $customerId);
        if ($existing !== null) {
            return $existing;
        }

        $stmt = $pdo->prepare('INSERT INTO customer_carts (customer_id, status) VALUES (:customer_id, :status)');
        $stmt->execute([
            'customer_id' => $customerId,
            'status' => 'active',
        ]);

        return (int) $pdo->lastInsertId();
    }

    private function getActiveCartPayload(PDO $pdo, int $customerId): array
    {
        $cartId = $this->findActiveCartId($pdo, $customerId);
        if ($cartId === null) {
            return [
                'cart_id' => null,
                'items' => [],
            ];
        }

        $stmt = $pdo->prepare('
            SELECT
                ci.id AS cart_item_id,
                ci.quantity,
                ci.unit_price,
                ci.is_selected,
                p.id AS product_id,
                p.sku,
                p.name,
                p.category,
                p.presentation,
                p.price,
                p.stock,
                p.status
            FROM customer_cart_items ci
            INNER JOIN products p ON p.id = ci.product_id
            WHERE ci.cart_id = :cart_id
            ORDER BY ci.id ASC
        ');
        $stmt->execute(['cart_id' => $cartId]);

        $items = array_map(function (array $row): array {
            return [
                'cart_item_id' => (int) ($row['cart_item_id'] ?? 0),
                'product_id' => (int) ($row['product_id'] ?? 0),
                'sku' => (string) ($row['sku'] ?? ''),
                'id' => (string) ($row['sku'] ?? ''),
                'name' => (string) ($row['name'] ?? 'Producto'),
                'category' => (string) ($row['category'] ?? ''),
                'presentation' => (string) ($row['presentation'] ?? ''),
                'price' => (float) ($row['price'] ?? 0),
                'unit_price' => (float) ($row['unit_price'] ?? 0),
                'stock' => (int) ($row['stock'] ?? 0),
                'status' => (string) ($row['status'] ?? 'active'),
                'quantity' => (int) ($row['quantity'] ?? 0),
                'selected' => ((int) ($row['is_selected'] ?? 0)) === 1,
            ];
        }, $stmt->fetchAll());

        return [
            'cart_id' => $cartId,
            'items' => $items,
        ];
    }

    private function ensureAddressesTable(PDO $pdo): void
    {
        $pdo->exec('
            CREATE TABLE IF NOT EXISTS customer_addresses (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                customer_id INT UNSIGNED NOT NULL,
                label VARCHAR(80) NOT NULL,
                recipient_name VARCHAR(150) NOT NULL,
                phone VARCHAR(30) DEFAULT NULL,
                address_line VARCHAR(255) NOT NULL,
                reference VARCHAR(255) DEFAULT NULL,
                city VARCHAR(120) NOT NULL,
                province VARCHAR(120) DEFAULT NULL,
                is_default TINYINT(1) NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT fk_customer_addresses_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
                KEY idx_customer_addresses_customer (customer_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ');
    }

    private function normalizeAddressPayload(array $payload, bool $requireAll = true): ?array
    {
        $data = [
            'label' => trim((string) ($payload['label'] ?? '')),
            'recipient_name' => trim((string) ($payload['recipient_name'] ?? '')),
            'phone' => trim((string) ($payload['phone'] ?? '')),
            'address_line' => trim((string) ($payload['address_line'] ?? '')),
            'reference' => trim((string) ($payload['reference'] ?? '')),
            'city' => trim((string) ($payload['city'] ?? '')),
            'province' => trim((string) ($payload['province'] ?? '')),
            'is_default' => !empty($payload['is_default']),
        ];

        if ($requireAll) {
            if ($data['label'] === '' || $data['recipient_name'] === '' || $data['address_line'] === '' || $data['city'] === '') {
                $this->error('Completa etiqueta, destinatario, direccion y ciudad.', 422);
                return null;
            }
        } elseif (
            $data['label'] === ''
            || $data['recipient_name'] === ''
            || $data['address_line'] === ''
            || $data['city'] === ''
        ) {
            return null;
        }

        return $data;
    }

    private function getCustomerAddresses(PDO $pdo, int $customerId): array
    {
        $stmt = $pdo->prepare('
            SELECT
                id,
                label,
                recipient_name,
                phone,
                address_line,
                reference,
                city,
                province,
                is_default,
                created_at,
                updated_at
            FROM customer_addresses
            WHERE customer_id = :customer_id
            ORDER BY is_default DESC, updated_at DESC, id DESC
        ');
        $stmt->execute(['customer_id' => $customerId]);

        return array_map(static function (array $row): array {
            return [
                'id' => (int) ($row['id'] ?? 0),
                'label' => (string) ($row['label'] ?? ''),
                'recipient_name' => (string) ($row['recipient_name'] ?? ''),
                'phone' => (string) ($row['phone'] ?? ''),
                'address_line' => (string) ($row['address_line'] ?? ''),
                'reference' => (string) ($row['reference'] ?? ''),
                'city' => (string) ($row['city'] ?? ''),
                'province' => (string) ($row['province'] ?? ''),
                'is_default' => ((int) ($row['is_default'] ?? 0)) === 1,
                'created_at' => isset($row['created_at']) ? (string) $row['created_at'] : null,
                'updated_at' => isset($row['updated_at']) ? (string) $row['updated_at'] : null,
            ];
        }, $stmt->fetchAll());
    }

    private function formatShippingAddressNote(array $address): string
    {
        $label = trim((string) ($address['label'] ?? ''));
        $recipient = trim((string) ($address['recipient_name'] ?? ''));
        $line = trim((string) ($address['address_line'] ?? ''));
        $city = trim((string) ($address['city'] ?? ''));
        $province = trim((string) ($address['province'] ?? ''));
        $reference = trim((string) ($address['reference'] ?? ''));

        if ($line === '' || $city === '') {
            return '';
        }

        $parts = array_filter([
            $label !== '' ? $label : null,
            $recipient !== '' ? $recipient : null,
            $line,
            $city,
            $province !== '' ? $province : null,
            $reference !== '' ? 'Ref. ' . $reference : null,
        ]);

        return $parts === [] ? '' : 'Direccion de envio: ' . implode(', ', $parts);
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













