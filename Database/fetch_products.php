<?php
require_once 'database.php';

$sql = "SELECT product_id, name, price, image_url FROM products";
$result = $conn->query($sql);

$products = [];
if ($result) {
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
    } else {
        $products[] = ["message" => "No products found"];
    }
} else {
    $products[] = ["error" => "Error executing query: " . $conn->error];
}

echo json_encode($products);

$conn->close();
