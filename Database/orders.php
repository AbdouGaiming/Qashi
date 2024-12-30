<?php
require 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    if ($action === 'update' && isset($_POST['order_id']) && isset($_POST['status'])) {
        $order_id = intval($_POST['order_id']);
        $status = $_POST['status'];

        // Validate the status value
        $allowed_statuses = ['Pending', 'Completed', 'Cancelled'];
        if (!in_array($status, $allowed_statuses)) {
            echo json_encode(['success' => false, 'message' => 'Invalid status value.']);
            exit();
        }

        $query = "UPDATE orders SET status = ? WHERE order_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('si', $status, $order_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Order status updated.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update order status.']);
        }

        $stmt->close();
        $conn->close();
    } elseif ($action === 'delete' && isset($_POST['order_id'])) {
        $order_id = intval($_POST['order_id']);

        // Check if order_id is valid
        if ($order_id <= 0) {
            echo json_encode(['success' => false, 'message' => 'Invalid order ID.']);
            exit();
        }

        $query = "DELETE FROM orders WHERE order_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('i', $order_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Order deleted.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete order.']);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action or missing parameters.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
}
