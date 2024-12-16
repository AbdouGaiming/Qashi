<?php
require 'database.php';

header('Content-Type: application/json');

// Example user ID - replace with session/user authentication logic
if (isset($_GET['user_id'])) {
    $user_id = $_GET['user_id'];
}

if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
    exit();
}

try {
    // Fetch user data from the database
    $query = "SELECT firstname, lastname, datebirth, phone, email FROM users WHERE user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $userData = $result->fetch_assoc();
        echo json_encode(['success' => true, 'data' => $userData]);
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error fetching user data.', 'error' => $e->getMessage()]);
}

$conn->close();
?>