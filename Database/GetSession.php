<?php
session_start();

// Set content type to JSON
header('Content-Type: application/json');

// Check if session variables for login or signup exist
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    // Respond with success and session data
    echo json_encode([
        'success' => true,
        'data' => [
            'user_id' => $user_id
        ]
    ]);
} else {
    // No session detected
    echo json_encode([
        'success' => false,
        'message' => 'No active session found. Please log in.'
    ]);
}
