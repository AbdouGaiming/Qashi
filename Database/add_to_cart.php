<?php
require 'database.php'; // Include the database connection
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Sanitize and retrieve inputs
    $product_id = intval($_GET['product_id']);
    $quantity = intval($_GET['quantity']);
    $size = trim($_GET['size']);
    $color = trim($_GET['color']);
    $user_id = 16; // Replace with the actual user session ID

    // Validate required inputs
    if (empty($product_id) || empty($quantity) || empty($size) || empty($color)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        exit();
    }

    // Check if product exists
    $productQuery = "SELECT * FROM products WHERE product_id = ?";
    $stmt = $conn->prepare($productQuery);
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $productResult = $stmt->get_result();

    if ($productResult->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Product not found.']);
        exit();
    }

    // 1. Check if a cart already exists for the user; otherwise, create one
    $cartQuery = "SELECT cart_id FROM carts WHERE user_id = ?";
    $stmt = $conn->prepare($cartQuery);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $cartResult = $stmt->get_result();

    if ($cartResult->num_rows > 0) {
        // Fetch the existing cart ID
        $cart = $cartResult->fetch_assoc();
        $cart_id = $cart['cart_id'];
    } else {
        // Create a new cart for the user
        $createCartQuery = "INSERT INTO carts (user_id, created_at) VALUES (?, NOW())";
        $stmt = $conn->prepare($createCartQuery);
        $stmt->bind_param("i", $user_id);

        if (!$stmt->execute()) {
            echo json_encode(['success' => false, 'message' => 'Failed to create a cart.']);
            exit();
        }

        $cart_id = $stmt->insert_id; // Retrieve the new cart ID
    }

    // 2. Insert or update the product in cart_items
    $insertItemQuery = "
        INSERT INTO cart_items (cart_id, product_id, quantity, size, color)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    ";
    $stmt = $conn->prepare($insertItemQuery);
    $stmt->bind_param("iiiss", $cart_id, $product_id, $quantity, $size, $color);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Product added to cart successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add product to cart.']);
    }

    // Close connections
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
