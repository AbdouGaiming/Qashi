<?php
require_once 'database.php';

header('Content-Type: application/json');

$product_id = isset($_GET['product_id']) ? intval($_GET['product_id']) : 0;

if ($product_id > 0) {
    $sql = "SELECT color, size, stock_quantity FROM product_variants WHERE product_id = $product_id";
    $result = $conn->query($sql);

    $variants = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $variants[] = $row;
        }
    }
    echo json_encode($variants);
} else {
    echo json_encode(["error" => "Invalid product ID."]);
}

$conn->close();
?>