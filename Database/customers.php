<?php
require 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    if ($action === 'add') {
        $firstname = $_POST['firstname'];
        $lastname = $_POST['lastname'];
        $email = $_POST['email'];
        $phone = $_POST['phone'];

        $sql = "INSERT INTO users (firstname, lastname, email, phone, user_type) VALUES (?, ?, ?, ?, 'Buyer')";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssss', $firstname, $lastname, $email, $phone);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Customer added successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to add customer.']);
        }

        $stmt->close();
    } elseif ($action === 'update' && isset($_POST['user_id'])) {
        $user_id = intval($_POST['user_id']);
        $firstname = $_POST['firstname'];
        $lastname = $_POST['lastname'];
        $email = $_POST['email'];
        $phone = $_POST['phone'];

        $sql = "UPDATE users SET firstname = ?, lastname = ?, email = ?, phone = ? WHERE user_id = ?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssssi', $firstname, $lastname, $email, $phone, $user_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Customer updated successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update customer.']);
        }

        $stmt->close();
    } elseif ($action === 'delete' && isset($_POST['user_id'])) {
        $user_id = intval($_POST['user_id']);

        $sql = "DELETE FROM users WHERE user_id = ?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $user_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Customer deleted successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete customer.']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action or missing parameters.']);
    }

    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
}
