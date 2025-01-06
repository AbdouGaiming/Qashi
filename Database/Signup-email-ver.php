<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');



require 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['email'])) {
        $email = trim($_POST['email']);

        // Check for duplicate email
        $query = "SELECT * FROM users WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Email is already in use.']);
        } else {
            echo json_encode(['success' => true, 'message' => 'Email is available.']);
        }

        $stmt->close();
        $conn->close();
        exit();
    }
}
