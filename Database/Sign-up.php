<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
   // En-têtes autorisés

require 'database.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Sanitize and retrieve inputs
    $first_name = trim($_GET['username'] ?? '');
    $last_name = trim($_GET['position'] ?? '');
    $email = trim($_GET['email'] ?? '');
    $password = trim($_GET['password'] ?? '');
    $phone = trim($_GET['phone'] ?? '');
    $dob = trim($_GET['dob'] ?? '');
    $user_type = 'Buyer'; // Default user type

    // Validate required fields
    if (empty($first_name) || empty($last_name) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        exit();
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
        exit();
    }

    // Check for duplicate email
    $query = "SELECT * FROM users WHERE email = ?";
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

    // Insert new user into the database
    $insertQuery = "INSERT INTO users (firstname, lastname, email, password, phone, datebirth, user_type) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($insertQuery);
    $stmt->bind_param('sssssss', $first_name, $last_name, $email, $hashedPassword, $phone, $dob, $user_type);

    if ($stmt->execute()) {
        // After successful insert, store the user id in session
        $userId = $stmt->insert_id; // Get the ID of the newly created user
        $_SESSION['user_id'] = $userId;

        echo json_encode(['success' => true, 'message' => 'Account created successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create account.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
