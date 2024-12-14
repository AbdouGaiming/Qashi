<?php
header('Content-Type: application/json');

require_once 'database.php';

// Fetch all cart items with product details
$sql = "
    SELECT p.name, p.price, p.image_url, ci.quantity, ci.id
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.product_id";

$result = $conn->query($sql);

$cartItems = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $cartItems[] = $row;
    }
}

echo json_encode($cartItems);

$conn->close();
