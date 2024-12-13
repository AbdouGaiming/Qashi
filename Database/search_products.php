<?php
    require_once 'database.php';

    $searchTerm = isset($_GET['query']) ? $_GET['query'] : '';

    $sql = "SELECT product_id, name, description, price, image_url FROM products 
            WHERE name LIKE ? OR description LIKE ?";
    $stmt = $conn->prepare($sql);
    $searchTermWildcard = '%' . $searchTerm . '%';
    $stmt->bind_param('ss', $searchTermWildcard, $searchTermWildcard);
    $stmt->execute();
    $result = $stmt->get_result();

    $products = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
    }

    echo json_encode($products);

    $stmt->close();
    $conn->close();
