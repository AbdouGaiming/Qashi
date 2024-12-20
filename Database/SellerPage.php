<?php
require 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Retrieve and sanitize inputs
    $first_name = trim($_GET['firstname'] ?? '');
    $last_name = trim($_GET['lastname'] ?? '');
    $email = trim($_GET['email'] ?? '');
    $phone = trim($_GET['phone'] ?? '');
    $dob = trim($_GET['dob'] ?? '');
    $store_name = trim($_GET['storeName'] ?? '');
    $store_address = trim($_GET['storeAddress'] ?? '');
    $password = trim($_GET['password'] ?? '');

    // Validate required fields
    if (empty($first_name) || empty($last_name) || empty($email) || empty($password) || empty($store_name) || empty($store_address)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        exit();
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
        exit();
    }

    // Check for duplicate email
    $query = "SELECT * FROM sellers WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email is already in use.']);
        exit();
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert new seller
    $insertQuery = "INSERT INTO sellers (firstname, lastname, email, phone, dob, store_name, store_address, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($insertQuery);
    $stmt->bind_param('ssssssss', $first_name, $last_name, $email, $phone, $dob, $store_name, $store_address, $hashedPassword);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Seller account created successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create seller account.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
