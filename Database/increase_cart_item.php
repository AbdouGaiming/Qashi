<?php
header('Content-Type: application/json');

try {
    require 'database.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $id = intval($_POST['id']); // Get the item ID
        $query = "UPDATE cart_items  SET quantity = quantity + 1 WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('i', $id);

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
?>
