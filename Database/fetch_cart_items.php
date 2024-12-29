<?php
session_start(); // Start the session

require 'database.php'; // Include the database connection
header("Content-Type: application/json");

try {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'User not logged in.']);
        exit();
    }

    // Retrieve user_id from session
    $user_id = $_SESSION['user_id'];

    // Query to get the cart ID for the user
    $cartQuery = "SELECT cart_id FROM carts WHERE user_id = ?";
    $stmt = $conn->prepare($cartQuery);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $cartResult = $stmt->get_result();

    if ($cartResult->num_rows === 0) {
        echo json_encode(['success' => true, 'cart_items' => []]); // No cart found, return empty array
        exit();
    }

    $cart = $cartResult->fetch_assoc();
    $cart_id = $cart['cart_id'];

    // Query to get cart items for the user's cart
    $itemsQuery = "
        SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.image_url
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.product_id
        WHERE ci.cart_id = ?
    ";
    $stmt = $conn->prepare($itemsQuery);
    $stmt->bind_param("i", $cart_id);
    $stmt->execute();
    $itemsResult = $stmt->get_result();

    $cartItems = [];
    while ($item = $itemsResult->fetch_assoc()) {
        $cartItems[] = $item;
    }

    echo json_encode(['success' => true, 'cart_items' => $cartItems]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    $stmt->close();
    $conn->close();
}
