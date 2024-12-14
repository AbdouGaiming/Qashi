<?php
require 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['product_id'])) {
    $product_id = intval($_GET['product_id']);

    // Fetch product details
    $query = "SELECT p.product_id, p.name, p.description, p.price, p.discount_price, p.image_url, c.color, s.size
              FROM products p
              LEFT JOIN product_colors c ON p.product_id = c.product_id
              LEFT JOIN product_sizes s ON p.product_id = s.product_id
              WHERE p.product_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $product_id);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $product_data = [];
        
        // Parse product data
        while ($row = $result->fetch_assoc()) {
            $product_data['id'] = $row['product_id'];
            $product_data['name'] = $row['name'];
            $product_data['description'] = $row['description'];
            $product_data['price'] = $row['price'];
            $product_data['discount_price'] = $row['discount_price'];
            $product_data['image_url'][] = $row['image_url'];
            $product_data['colors'][] = $row['color'];
            $product_data['sizes'][] = $row['size'];
        }

        echo json_encode($product_data);
    } else {
        echo json_encode(['error' => 'Failed to fetch product details.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'Invalid request.']);
}

    