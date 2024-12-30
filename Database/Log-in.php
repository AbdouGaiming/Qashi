<?php
require_once 'database.php';


// Handle login request
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    file_put_contents("debug_log.txt", "PHP script accessed.\n", FILE_APPEND);

    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    // Validate input
    if (empty($email) || empty($password)) {
        file_put_contents("debug_log.txt", "Validation failed: Missing fields.\n", FILE_APPEND);
        echo json_encode(["status" => "error", "message" => "All fields are required."]);
        exit;
    }

    // Sanitize input
    $email = $conn->real_escape_string($email);
    $password = $conn->real_escape_string($password);

    file_put_contents("debug_log.txt", "Input sanitized. Email: $email\n", FILE_APPEND);

    // Query to check user credentials
    $sql = "SELECT * FROM users WHERE email = '$email' AND password = '$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        file_put_contents("debug_log.txt", "User found: $email\n", FILE_APPEND);
        echo json_encode(["status" => "success", "message" => "Login successful."]);
    } else {
        file_put_contents("debug_log.txt", "User not found: $email\n", FILE_APPEND);
        echo json_encode(["status" => "error", "message" => "Invalid email or password."]);
    }
}

$conn->close();
