<?php
require 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['category'])) {
    $category = $_GET['category'];

    // Prepare and execute the query
    $query = "SELECT product_id, name, description, price, stock, category, image_url FROM products WHERE category = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $category);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $products = [];

        // Fetch products as an associative array
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }

        // Return the products in JSON format
        echo json_encode($products);
    } else {
        echo json_encode(['error' => 'Failed to fetch products.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'Invalid request.']);
}
