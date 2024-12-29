<?php
require 'database.php';

header('Content-Type: application/json');

// Retrieve and sanitize filter inputs
$category = isset($_GET['category']) ? trim($_GET['category']) : '';
$subcategory = isset($_GET['subcategory']) ? trim($_GET['subcategory']) : '';
$color = isset($_GET['color']) ? trim($_GET['color']) : '';
$size = isset($_GET['size']) ? trim($_GET['size']) : '';

try {
    // Base query with JOIN for product_variants table
    $query = "
        SELECT 
            p.product_id, 
            p.name, 
            p.price, 
            p.category, 
            pv.color, 
            pv.size, 
            p.image_url
        FROM 
            products p
        LEFT JOIN 
            product_variants pv 
        ON 
            p.product_id = pv.product_id
        WHERE 1=1
    ";

    // Dynamic conditions and parameters
    $params = [];
    $types = '';

    if (!empty($category)) {
        $query .= " AND p.category = ?";
        $params[] = $category;
        $types .= 's';
    }

    if (!empty($subcategory)) {
        $query .= " AND p.subcategory = ?";
        $params[] = $subcategory;
        $types .= 's';
    }

    if (!empty($color)) {
        $query .= " AND pv.color = ?";
        $params[] = $color;
        $types .= 's';
    }

    if (!empty($size)) {
        $query .= " AND pv.size = ?";
        $params[] = $size;
        $types .= 's';
    }

    // Debugging: Log query to help troubleshooting
    file_put_contents("query_log.txt", $query . " - " . print_r($params, true) . "\n", FILE_APPEND);

    // Prepare the statement
    $stmt = $conn->prepare($query);

    // Bind parameters dynamically if filters exist
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    // Fetch results
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    // Return JSON response
    echo json_encode([
        'success' => true,
        'products' => $products
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching products.',
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?>
