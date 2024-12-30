<?php
session_start(); // Start the session
header('Content-Type: application/json');

try {
    require 'database.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['success' => false, 'message' => 'User not logged in.']);
            exit();
        }

        // Retrieve user_id from session
        $user_id = $_SESSION['user_id'];

        // Get the cart ID for the user
        $cartQuery = "SELECT cart_id FROM carts WHERE user_id = ?";
        $stmt = $conn->prepare($cartQuery);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $cartResult = $stmt->get_result();

        if ($cartResult->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Cart not found.']);
            exit();
        }

        $cart = $cartResult->fetch_assoc();
        $cart_id = $cart['cart_id'];

        $id = intval($_POST['id']); // Get the item ID

        $query = "UPDATE cart_items SET quantity = quantity + 1 WHERE id = ? AND cart_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('ii', $id, $cart_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update cart item.']);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
