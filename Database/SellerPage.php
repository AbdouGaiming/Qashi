<?php
require ("database.php");
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

    // Database connection
    // $conn = mysqli_connect('localhost', 'root', '', 'qashi'); // Replace with your DB credentials

    // if (!$conn) {
    //     die("Connection failed: " . mysqli_connect_error());
    // }

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
                        VALUES ('$firstname', '$lastname', '$dob', '$phone', '$email', '$hashedPassword', '$user_type')";

    if (mysqli_query($conn, $userInsertQuery)) {
        // Get the new user's ID
        $userId = mysqli_insert_id($conn);

        // Insert data into stores table
        $storeInsertQuery = "INSERT INTO stores (store_name, store_address, user_id) 
                             VALUES ('$storeName', '$storeAddress', $userId)";

        if (mysqli_query($conn, $storeInsertQuery)) {
            // Store user details in the session
            $_SESSION['user_id'] = $userId;
           
            echo json_encode(['success' => true, 'message' => 'Seller account and store created successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error creating the store']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Error creating the user account']);
    }

    // Close the database connection
    mysqli_close($conn);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
