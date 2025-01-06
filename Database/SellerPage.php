<?php
require("database.php");
session_start(); // Start the session

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Sanitize and retrieve inputs
    $firstname = trim($_GET['firstname'] ?? '');
    $lastname = trim($_GET['lastname'] ?? '');
    $phone = trim($_GET['phone'] ?? '');
    $email = trim($_GET['email'] ?? '');
    $dob = trim($_GET['dob'] ?? '');
    $storeName = trim($_GET['storeName'] ?? '');
    $storeAddress = trim($_GET['storeAddress'] ?? '');
    $password = trim($_GET['password'] ?? '');
    $user_type = 'Seller'; // Default user type

    // Validate required fields
    if (empty($firstname) || empty($lastname) || empty($email) || empty($password) || empty($storeName) || empty($storeAddress)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        exit();
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
        exit();
    }

    // Connect to the database
    $conn = new mysqli('localhost', 'root', '', 'qashi'); // Update with your DB credentials

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
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

    // Insert data into users table
    $userInsertQuery = "INSERT INTO users (firstname, lastname, datebirth, phone, email, password, user_type) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($userInsertQuery);
    $stmt->bind_param('sssssss', $firstname, $lastname, $dob, $phone, $email, $hashedPassword, $user_type);

    if ($stmt->execute()) {
        // Get the new user's ID
        $userId = $stmt->insert_id;

        // Insert data into stores table
        $storeInsertQuery = "INSERT INTO stores (store_name, store_address, store_id) 
                             VALUES (?, ?, ?)";
        $stmt = $conn->prepare($storeInsertQuery);
        $stmt->bind_param('ssi', $storeName, $storeAddress, $userId);

        if ($stmt->execute()) {
            // Store user details in the session
            $_SESSION['user_id'] = $userId;

            echo json_encode(['success' => true, 'message' => 'Seller account and store created successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error creating the store']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Error creating the user account']);
    }

    // Close the connection
    $conn->close();
}
?>
