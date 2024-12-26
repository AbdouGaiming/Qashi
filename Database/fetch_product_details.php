<?php
require 'database.php'; // Database connection

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id']) && !empty($_GET['id'])) {
        $product_id = intval($_GET['id']);

        // Query to fetch product details
        $productQuery = "SELECT p.product_id, p.name, p.description, p.price, p.image_url 
                         FROM products p 
                         WHERE p.product_id = ?";
        $stmt = $conn->prepare($productQuery);
        $stmt->bind_param("i", $product_id);
        $stmt->execute();
        $productResult = $stmt->get_result();

        if ($productResult->num_rows > 0) {
            $product = $productResult->fetch_assoc();

            // Query to fetch unique colors from product_variants
            $colorsQuery = "SELECT DISTINCT color FROM product_variants WHERE product_id = ?";
            $stmtColors = $conn->prepare($colorsQuery);
            $stmtColors->bind_param("i", $product_id);
            $stmtColors->execute();
            $colorsResult = $stmtColors->get_result();

            $colors = [];
            while ($row = $colorsResult->fetch_assoc()) {
                $colors[] = $row['color'];
            }

            // Query to fetch unique sizes from product_variants
            $sizesQuery = "SELECT DISTINCT size FROM product_variants WHERE product_id = ?";
            $stmtSizes = $conn->prepare($sizesQuery);
            $stmtSizes->bind_param("i", $product_id);
            $stmtSizes->execute();
            $sizesResult = $stmtSizes->get_result();

            $sizes = [];
            while ($row = $sizesResult->fetch_assoc()) {
                $sizes[] = $row['size'];
            }

            // Final product data response
            $response = [
                "success" => true,
                "product" => [
                    "product_id" => $product['product_id'],
                    "name" => $product['name'],
                    "description" => $product['description'],
                    "price" => $product['price'],
                    "image_url" => $product['image_url'],
                    "colors" => $colors,
                    "sizes" => $sizes
                ]
            ];
        } else {
            $response = ["success" => false, "message" => "Product not found."];
        }

        // Return JSON response
        header("Content-Type: application/json");
        echo json_encode($response, JSON_PRETTY_PRINT);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid product ID."]);
    }

    // Close database connections
    $stmt->close();
    $stmtColors->close();
    $stmtSizes->close();
    $conn->close();
}
