<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use PDO;
use Throwable;

final class InventoryController
{
    private const DEFAULT_CATALOG = [
        [
            'sku' => 'INS-001',
            'name' => 'Semilla maiz dorado',
            'category' => 'insumos',
            'presentation' => 'Saco',
            'price' => 82,
            'stock' => 24,
            'details' => [
                'subcategory' => 'Semillas',
                'unit' => 'und',
                'content' => 'Saco de 25 kg',
                'usage' => 'Siembra extensiva',
                'notes' => 'Ficha base',
                'status_label' => 'Disponible',
            ],
        ],
        [
            'sku' => 'INS-009',
            'name' => 'Herbicida selectivo H60',
            'category' => 'insumos',
            'presentation' => 'Botella',
            'price' => 19,
            'stock' => 18,
            'details' => [
                'subcategory' => 'Pesticidas',
                'unit' => 'und',
                'content' => 'Botella de 1 litro',
                'usage' => 'Control de malezas',
                'notes' => 'Ficha base',
                'status_label' => 'Disponible',
            ],
        ],
        [
            'sku' => 'INS-024',
            'name' => 'Cinta riego gota fina',
            'category' => 'insumos',
            'presentation' => 'Rollo',
            'price' => 35,
            'stock' => 12,
            'details' => [
                'subcategory' => 'Accesorios',
                'unit' => 'und',
                'content' => 'Rollo de 1000 metros',
                'usage' => 'Riego por goteo',
                'notes' => 'Ficha base',
                'status_label' => 'Disponible',
            ],
        ],
        [
            'sku' => 'ABO-009',
            'name' => 'Fertimax 20-20-20',
            'category' => 'abonos',
            'presentation' => 'Saco',
            'price' => 29,
            'stock' => 20,
            'details' => [
                'subcategory' => 'Quimico',
                'unit' => 'und',
                'content' => 'Lote base 2026',
                'usage' => 'Aplicacion foliar',
                'notes' => 'ISO proveedor',
                'status_label' => 'Disponible',
            ],
        ],
        [
            'sku' => 'ABO-017',
            'name' => 'Te de compost liquido',
            'category' => 'abonos',
            'presentation' => 'Botella',
            'price' => 17,
            'stock' => 16,
            'details' => [
                'subcategory' => 'Foliar',
                'unit' => 'und',
                'content' => 'Botella de 1 litro',
                'usage' => 'Refuerzo biologico',
                'notes' => 'EcoCert',
                'status_label' => 'Disponible',
            ],
        ],
        [
            'sku' => 'ABO-022',
            'name' => 'Cal agricola fina',
            'category' => 'abonos',
            'presentation' => 'Saco',
            'price' => 14,
            'stock' => 14,
            'details' => [
                'subcategory' => 'Enmienda',
                'unit' => 'und',
                'content' => 'Saco de 40 kg',
                'usage' => 'Correccion de pH',
                'notes' => 'Control interno',
                'status_label' => 'Disponible',
            ],
        ],
        [
            'sku' => 'HER-002',
            'name' => 'Tijeras de poda pro',
            'category' => 'herramientas',
            'presentation' => 'Unidad',
            'price' => 24,
            'stock' => 8,
            'details' => [
                'subcategory' => 'Manual',
                'unit' => 'und',
                'content' => 'Unidad de corte profesional',
                'usage' => 'Herramienta base',
                'notes' => 'Lista para asignacion',
                'status_label' => 'Disponible',
            ],
        ],
        [
            'sku' => 'HER-011',
            'name' => 'Pulverizador de mano',
            'category' => 'herramientas',
            'presentation' => 'Unidad',
            'price' => 21,
            'stock' => 10,
            'details' => [
                'subcategory' => 'Manual',
                'unit' => 'und',
                'content' => 'Deposito de 5 litros',
                'usage' => 'Herramienta base',
                'notes' => 'Lista para asignacion',
                'status_label' => 'Disponible',
            ],
        ],
        [
            'sku' => 'HER-013',
            'name' => 'Tractor de arado',
            'category' => 'herramientas',
            'presentation' => 'Maquina',
            'price' => 28500,
            'stock' => 2,
            'details' => [
                'subcategory' => 'Maquinaria',
                'unit' => 'und',
                'content' => 'Motor diesel 90 HP para labores de arado',
                'usage' => 'Equipo base',
                'notes' => 'Programar mantenimiento',
                'status_label' => 'Disponible',
            ],
        ]
    ];
    public function inventoryState(): void
    {
        try {
            $pdo = Database::connection();
            $stmt = $pdo->query('SELECT * FROM products WHERE status = "active" ORDER BY sku ASC');
            $products = $stmt->fetchAll();

            if (count($products) <= 1) {
                $this->seedDefaultCatalog($pdo, $products);
                $stmt = $pdo->query('SELECT * FROM products WHERE status = "active" ORDER BY sku ASC');
                $products = $stmt->fetchAll();
            }

            $state = [
                'insumos' => [],
                'abonos' => [],
                'herramientas' => [],
            ];

            foreach ($products as $product) {
                $category = $this->normalizeCategory((string) ($product['category'] ?? ''), (string) ($product['sku'] ?? ''));
                $state[$category][] = $this->formatProductRow($category, $product);
            }

            Response::json([
                'status' => 'ok',
                'data' => $state,
            ]);
        } catch (Throwable $error) {
            $this->error('No se pudo cargar el inventario.', 500);
        }
    }

    public function movements(): void
    {
        try {
            $limit = max(1, min((int) ($_GET['limit'] ?? 100), 200));
            $pdo = Database::connection();
            $stmt = $pdo->prepare('
                SELECT
                    m.id,
                    m.type,
                    m.quantity,
                    m.unit_cost,
                    m.total_cost,
                    m.note,
                    m.responsible_name,
                    m.created_at,
                    m.meta_json,
                    p.sku,
                    p.name,
                    p.category,
                    p.price,
                    p.stock
                FROM movements m
                INNER JOIN products p ON p.id = m.product_id
                ORDER BY m.created_at DESC, m.id DESC
                LIMIT :limit
            ');
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();

            $rows = array_map(fn (array $row): array => $this->formatMovementRow($row), $stmt->fetchAll());

            Response::json([
                'status' => 'ok',
                'data' => $rows,
            ]);
        } catch (Throwable $error) {
            $this->error('No se pudieron cargar los movimientos.', 500);
        }
    }

    public function sales(): void
    {
        if (!Auth::check()) {
            $this->error('Debes iniciar sesion para consultar ventas.', 401);
            return;
        }

        try {
            $limit = max(1, min((int) ($_GET['limit'] ?? 30), 100));
            $pdo = Database::connection();

            $sql = '
                SELECT
                    s.id,
                    s.sale_number,
                    s.sale_date,
                    s.subtotal,
                    s.discount,
                    s.total,
                    s.note,
                    pm.code AS payment_code,
                    pm.name AS payment_name,
                    c.full_name AS customer_name
                FROM sales s
                INNER JOIN customers c ON c.id = s.customer_id
                INNER JOIN payment_methods pm ON pm.id = s.payment_method_id
            ';

            if (Auth::isCustomer()) {
                $sql .= ' WHERE s.customer_id = :customer_id ';
            }

            $sql .= ' ORDER BY s.sale_date DESC, s.id DESC LIMIT :limit';

            $stmt = $pdo->prepare($sql);
            if (Auth::isCustomer()) {
                $stmt->bindValue(':customer_id', Auth::id(), PDO::PARAM_INT);
            }
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            $sales = $stmt->fetchAll();

            if ($sales === []) {
                Response::json([
                    'status' => 'ok',
                    'data' => [],
                ]);
                return;
            }

            $saleIds = array_map(static fn (array $sale): int => (int) $sale['id'], $sales);
            $placeholders = implode(',', array_fill(0, count($saleIds), '?'));
            $itemsStmt = $pdo->prepare("
                SELECT
                    si.sale_id,
                    si.quantity,
                    si.unit_price,
                    si.subtotal,
                    p.sku,
                    p.name,
                    p.category
                FROM sale_items si
                INNER JOIN products p ON p.id = si.product_id
                WHERE si.sale_id IN ($placeholders)
                ORDER BY si.id ASC
            ");
            $itemsStmt->execute($saleIds);

            $itemsBySale = [];
            foreach ($itemsStmt->fetchAll() as $item) {
                $saleId = (int) $item['sale_id'];
                $itemsBySale[$saleId][] = [
                    'category' => $this->normalizeCategory((string) ($item['category'] ?? ''), (string) ($item['sku'] ?? '')),
                    'id' => (string) $item['sku'],
                    'name' => (string) $item['name'],
                    'quantity' => (int) $item['quantity'],
                    'unitPrice' => (float) $item['unit_price'],
                    'subtotal' => (float) $item['subtotal'],
                ];
            }

            $payload = array_map(function (array $sale) use ($itemsBySale): array {
                $saleId = (int) $sale['id'];

                return [
                    'number' => (string) $sale['sale_number'],
                    'date' => substr((string) $sale['sale_date'], 0, 10),
                    'customer' => (string) $sale['customer_name'],
                    'payment' => (string) ($sale['payment_code'] ?: $sale['payment_name']),
                    'note' => (string) ($sale['note'] ?? ''),
                    'subtotal' => (float) $sale['subtotal'],
                    'discount' => (float) $sale['discount'],
                    'total' => (float) $sale['total'],
                    'items' => $itemsBySale[$saleId] ?? [],
                ];
            }, $sales);

            Response::json([
                'status' => 'ok',
                'data' => $payload,
            ]);
        } catch (Throwable $error) {
            $this->error('No se pudieron cargar las ventas.', 500);
        }
    }

    public function storeProduct(Request $request): void
    {
        if (!Auth::isAdmin()) {
            $this->error('Solo los administradores pueden crear productos.', 403);
            return;
        }

        $payload = $request->json();
        $product = $this->validateProductPayload($payload);
        if (is_string($product)) {
            $this->error($product, 422);
            return;
        }

        try {
            $pdo = Database::connection();
            $existing = $pdo->prepare('SELECT id FROM products WHERE sku = :sku LIMIT 1');
            $existing->execute(['sku' => $product['sku']]);
            if ($existing->fetch() !== false) {
                $this->error('Ya existe un producto con este codigo.', 409);
                return;
            }

            $stmt = $pdo->prepare('
                INSERT INTO products (name, sku, category, presentation, price, stock, status, details_json)
                VALUES (:name, :sku, :category, :presentation, :price, :stock, :status, :details_json)
            ');
            $stmt->execute([
                'name' => $product['name'],
                'sku' => $product['sku'],
                'category' => $product['category'],
                'presentation' => $product['presentation'],
                'price' => $product['price'],
                'stock' => 0,
                'status' => 'active',
                'details_json' => json_encode($product['details'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ]);

            Response::json([
                'status' => 'ok',
                'data' => ['sku' => $product['sku']],
            ], 201);
        } catch (Throwable $error) {
            $this->error('No se pudo crear el producto.', 500);
        }
    }

    public function updateProduct(Request $request): void
    {
        if (!Auth::isAdmin()) {
            $this->error('Solo los administradores pueden actualizar productos.', 403);
            return;
        }

        $payload = $request->json();
        $product = $this->validateProductPayload($payload);
        if (is_string($product)) {
            $this->error($product, 422);
            return;
        }

        try {
            $pdo = Database::connection();
            $check = $pdo->prepare('SELECT id FROM products WHERE sku = :sku LIMIT 1');
            $check->execute(['sku' => $product['sku']]);
            if ($check->fetch() === false) {
                $this->error('El producto no existe.', 404);
                return;
            }

            $stmt = $pdo->prepare('
                UPDATE products
                SET
                    name = :name,
                    category = :category,
                    presentation = :presentation,
                    price = :price,
                    details_json = :details_json
                WHERE sku = :sku
            ');
            $stmt->execute([
                'name' => $product['name'],
                'category' => $product['category'],
                'presentation' => $product['presentation'],
                'price' => $product['price'],
                'details_json' => json_encode($product['details'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                'sku' => $product['sku'],
            ]);

            Response::json([
                'status' => 'ok',
                'data' => ['sku' => $product['sku']],
            ]);
        } catch (Throwable $error) {
            $this->error('No se pudo actualizar el producto.', 500);
        }
    }

    public function deleteProduct(Request $request): void
    {
        if (!Auth::isAdmin()) {
            $this->error('Solo los administradores pueden eliminar productos.', 403);
            return;
        }

        $sku = trim((string) (($request->json())['sku'] ?? ''));
        if ($sku === '') {
            $this->error('Debes indicar el codigo del producto.', 422);
            return;
        }

        try {
            $pdo = Database::connection();
            $stmt = $pdo->prepare('DELETE FROM products WHERE sku = :sku LIMIT 1');
            $stmt->execute(['sku' => $sku]);

            if ($stmt->rowCount() === 0) {
                $this->error('El producto no existe.', 404);
                return;
            }

            Response::json([
                'status' => 'ok',
                'data' => ['sku' => $sku],
            ]);
        } catch (Throwable $error) {
            $this->error('No se pudo eliminar el producto.', 500);
        }
    }

    public function storeMovement(Request $request): void
    {
        if (!Auth::isAdmin()) {
            $this->error('Solo los administradores pueden registrar movimientos.', 403);
            return;
        }

        $payload = $request->json();
        $sku = trim((string) ($payload['sku'] ?? ''));
        $type = trim((string) ($payload['type'] ?? ''));
        $quantity = (int) ($payload['quantity'] ?? 0);
        $note = trim((string) ($payload['note'] ?? ''));
        $date = trim((string) ($payload['date'] ?? ''));
        $provider = trim((string) ($payload['provider'] ?? ''));
        $responsible = trim((string) ($payload['responsible'] ?? ''));
        $lot = trim((string) ($payload['lot'] ?? ''));
        $expiry = trim((string) ($payload['expiry'] ?? ''));
        $reference = trim((string) ($payload['reference'] ?? ''));
        $costUnit = $this->normalizeMoney($payload['cost_unit'] ?? 0);
        $costTotal = $this->normalizeMoney($payload['cost_total'] ?? 0);

        if ($sku === '') {
            $this->error('Debes seleccionar un producto.', 422);
            return;
        }

        if (!in_array($type, ['entrada', 'salida'], true)) {
            $this->error('El tipo de movimiento no es valido.', 422);
            return;
        }

        if ($quantity <= 0) {
            $this->error('La cantidad debe ser mayor a cero.', 422);
            return;
        }

        try {
            $pdo = Database::connection();
            $pdo->beginTransaction();

            $productStmt = $pdo->prepare('SELECT id, sku, stock, price FROM products WHERE sku = :sku LIMIT 1');
            $productStmt->execute(['sku' => $sku]);
            $product = $productStmt->fetch();

            if ($product === false) {
                $pdo->rollBack();
                $this->error('El producto seleccionado no existe.', 404);
                return;
            }

            $currentStock = (int) ($product['stock'] ?? 0);
            $nextStock = $type === 'entrada'
                ? $currentStock + $quantity
                : $currentStock - $quantity;

            if ($nextStock < 0) {
                $pdo->rollBack();
                $this->error('La salida no puede dejar el stock en negativo.', 422);
                return;
            }

            $nextPrice = $type === 'entrada' && $costUnit > 0
                ? $costUnit
                : (float) ($product['price'] ?? 0);

            $updateStmt = $pdo->prepare('UPDATE products SET stock = :stock, price = :price WHERE id = :id');
            $updateStmt->execute([
                'stock' => $nextStock,
                'price' => $nextPrice,
                'id' => (int) $product['id'],
            ]);

            $metaJson = json_encode([
                'provider' => $provider,
                'lot' => $lot,
                'expiry' => $expiry,
                'reference' => $reference,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

            $movementStmt = $pdo->prepare('
                INSERT INTO movements (product_id, type, reason, quantity, unit_cost, total_cost, note, responsible_name, created_at, meta_json)
                VALUES (:product_id, :type, :reason, :quantity, :unit_cost, :total_cost, :note, :responsible_name, :created_at, :meta_json)
            ');
            $movementStmt->execute([
                'product_id' => (int) $product['id'],
                'type' => $type,
                'reason' => $type === 'entrada' ? 'compra' : 'ajuste',
                'quantity' => $quantity,
                'unit_cost' => $costUnit > 0 ? $costUnit : null,
                'total_cost' => $costTotal > 0 ? $costTotal : ($costUnit > 0 ? $costUnit * $quantity : null),
                'note' => $note !== '' ? $note : null,
                'responsible_name' => $responsible !== '' ? $responsible : 'Administrador',
                'created_at' => $this->normalizeDateTime($date),
                'meta_json' => $metaJson,
            ]);

            $pdo->commit();

            Response::json([
                'status' => 'ok',
                'data' => [
                    'sku' => $sku,
                    'stock' => $nextStock,
                ],
            ], 201);
        } catch (Throwable $error) {
            if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            $this->error('No se pudo registrar el movimiento.', 500);
        }
    }

    private function validateProductPayload(array $payload): array|string
    {
        $sku = trim((string) ($payload['sku'] ?? ''));
        $name = trim((string) ($payload['name'] ?? ''));
        $category = $this->normalizeCategory((string) ($payload['category'] ?? ''), $sku);
        $subcategory = trim((string) ($payload['subcategory'] ?? ''));
        $presentation = trim((string) ($payload['presentation'] ?? ''));
        $unit = trim((string) ($payload['unit'] ?? 'und'));
        $content = trim((string) ($payload['content'] ?? ''));
        $usage = trim((string) ($payload['usage'] ?? ''));
        $notes = trim((string) ($payload['notes'] ?? ''));
        $status = trim((string) ($payload['status'] ?? 'Disponible'));
        $price = $this->normalizeMoney($payload['price'] ?? 0);

        if ($sku === '' || $name === '' || $presentation === '') {
            return 'Completa los campos principales del producto.';
        }

        return [
            'sku' => $sku,
            'name' => $name,
            'category' => $category,
            'presentation' => $presentation,
            'price' => $price,
            'details' => [
                'subcategory' => $subcategory !== '' ? $subcategory : 'General',
                'unit' => $unit !== '' ? $unit : 'und',
                'content' => $content !== '' ? $content : 'Sin detalle',
                'usage' => $usage !== '' ? $usage : 'Ficha base',
                'notes' => $notes !== '' ? $notes : 'Sin notas',
                'status_label' => $status !== '' ? $status : 'Disponible',
            ],
        ];
    }

    private function formatProductRow(string $category, array $row): array
    {
        $details = $this->decodeJson((string) ($row['details_json'] ?? ''));
        $sku = (string) ($row['sku'] ?? '');
        $name = (string) ($row['name'] ?? 'Producto');
        $subcategory = (string) ($details['subcategory'] ?? 'General');
        $presentation = (string) ($row['presentation'] ?? 'Unidad');
        $stock = (string) ((int) ($row['stock'] ?? 0));
        $unit = (string) ($details['unit'] ?? 'und');
        $content = (string) ($details['content'] ?? $presentation);
        $price = '$' . number_format((float) ($row['price'] ?? 0), 0, '.', '');
        $usage = (string) ($details['usage'] ?? 'Ficha base');
        $notes = (string) ($details['notes'] ?? 'Sin notas');
        $statusLabel = (string) ($details['status_label'] ?? 'Disponible');

        if ($category === 'herramientas') {
            return [
                $sku,
                $name,
                $subcategory,
                $presentation,
                $statusLabel,
                $stock,
                $content,
                $price,
                $usage,
                $unit,
                $notes,
            ];
        }

        return [
            $sku,
            $name,
            $subcategory,
            $presentation,
            $stock,
            $unit,
            $content,
            $price,
            $usage,
            $notes,
            $statusLabel,
        ];
    }

    private function formatMovementRow(array $row): array
    {
        $category = $this->normalizeCategory((string) ($row['category'] ?? ''), (string) ($row['sku'] ?? ''));
        $meta = $this->decodeJson((string) ($row['meta_json'] ?? ''));
        $type = (string) ($row['type'] ?? '');
        $quantity = (int) ($row['quantity'] ?? 0);
        $unitCost = (float) ($row['unit_cost'] ?? 0);
        $totalCost = (float) ($row['total_cost'] ?? 0);

        return [
            'type' => $type === 'entrada' ? 'Entrada' : ($type === 'salida' ? 'Salida' : 'Ajuste'),
            'category' => $category,
            'id' => (string) ($row['sku'] ?? ''),
            'name' => (string) ($row['name'] ?? 'Producto'),
            'amount' => $quantity,
            'date' => substr((string) ($row['created_at'] ?? date('Y-m-d')), 0, 10),
            'responsible' => (string) ($row['responsible_name'] ?? ''),
            'supplier' => (string) ($meta['provider'] ?? ''),
            'note' => (string) ($row['note'] ?? ''),
            'price' => '$' . number_format((float) ($row['price'] ?? 0), 2, '.', ''),
            'totalValue' => '$' . number_format($totalCost > 0 ? $totalCost : $unitCost * $quantity, 2, '.', ''),
            'stockAfter' => (int) ($row['stock'] ?? 0),
            'provider' => (string) ($meta['provider'] ?? ''),
            'costUnit' => $unitCost > 0 ? number_format($unitCost, 2, '.', '') : '',
            'costTotal' => $totalCost > 0 ? number_format($totalCost, 2, '.', '') : '',
            'lot' => (string) ($meta['lot'] ?? ''),
            'expiry' => (string) ($meta['expiry'] ?? ''),
            'reference' => (string) ($meta['reference'] ?? ''),
        ];
    }

    private function normalizeCategory(string $category, string $sku = ''): string
    {
        $normalized = strtolower(trim($category));
        if (in_array($normalized, ['insumos', 'abonos', 'herramientas'], true)) {
            return $normalized;
        }

        return match (true) {
            str_starts_with(strtoupper($sku), 'ABO-') => 'abonos',
            str_starts_with(strtoupper($sku), 'HER-') => 'herramientas',
            default => 'insumos',
        };
    }

    private function decodeJson(string $value): array
    {
        if ($value === '') {
            return [];
        }

        $decoded = json_decode($value, true);
        return is_array($decoded) ? $decoded : [];
    }

    private function normalizeMoney(mixed $value): float
    {
        if (is_numeric($value)) {
            return (float) $value;
        }

        $normalized = preg_replace('/[^0-9.,-]/', '', (string) $value) ?? '0';
        $normalized = str_replace(',', '.', $normalized);
        return (float) $normalized;
    }

    private function normalizeDateTime(string $date): string
    {
        if ($date === '') {
            return date('Y-m-d H:i:s');
        }

        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) === 1) {
            return $date . ' 00:00:00';
        }

        return date('Y-m-d H:i:s', strtotime($date) ?: time());
    }

    private function error(string $message, int $status = 400): void
    {
        Response::json([
            'status' => 'error',
            'message' => $message,
        ], $status);
    }
    private function seedDefaultCatalog(PDO $pdo, array $existingProducts): void
    {
        $existingSkus = array_map(static fn (array $row): string => (string) ($row['sku'] ?? ''), $existingProducts);


        $stmt = $pdo->prepare('
            INSERT INTO products (name, sku, category, presentation, price, stock, status, details_json)
            VALUES (:name, :sku, :category, :presentation, :price, :stock, :status, :details_json)
        ');

        foreach (self::DEFAULT_CATALOG as $product) {
            if (in_array($product['sku'], $existingSkus, true)) {
                continue;
            }

            $stmt->execute([
                'name' => $product['name'],
                'sku' => $product['sku'],
                'category' => $product['category'],
                'presentation' => $product['presentation'],
                'price' => $product['price'],
                'stock' => $product['stock'],
                'status' => 'active',
                'details_json' => json_encode($product['details'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ]);
        }
    }
}

