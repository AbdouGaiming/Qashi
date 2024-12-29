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

        $id = intval($_POST['id']); // Ensure the ID is an integer

        // First, check the current quantity of the item
        $query = "SELECT quantity FROM cart_items WHERE id = ? AND cart_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('ii', $id, $cart_id);
        $stmt->execute();
        $stmt->bind_result($quantity);
        $stmt->fetch();
        $stmt->close(); // Close the statement to avoid sync issues

        if ($quantity > 1) {
            // Decrease the quantity if it's greater than 1
            $updateQuery = "UPDATE cart_items SET quantity = quantity - 1 WHERE id = ? AND cart_id = ?";
            $updateStmt = $conn->prepare($updateQuery);
            $updateStmt->bind_param('ii', $id, $cart_id);
            if ($updateStmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Quantity decreased.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to decrease item quantity.']);
            }
            $updateStmt->close();
        } else {
            // If quantity is 1, remove the item from the cart
            $deleteQuery = "DELETE FROM cart_items WHERE id = ? AND cart_id = ?";
            $deleteStmt = $conn->prepare($deleteQuery);
            $deleteStmt->bind_param('ii', $id, $cart_id);
            if ($deleteStmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Item removed from cart.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to remove item from cart.']);
            }
            $deleteStmt->close();
        }
        $conn->close(); // Close the database connection
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
