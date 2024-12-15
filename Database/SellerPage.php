<?php
require_once 'database.php';

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $firstname = trim($_POST['firstname']);
    $lastname = trim($_POST['lastname']);
    $phone = trim($_POST['phone']);
    $email = trim($_POST['email']);
    $dob = trim($_POST['dob']);
    $storeName = trim($_POST['storeName']);
    $storeAddress = trim($_POST['storeAddress']);
    $password = trim($_POST['password']);
    $confirmPassword = trim($_POST['confirmPassword']);

    if ($password !== $confirmPassword) {
        $response['success'] = false;
        $response['message'] = 'Passwords do not match.';
    } else {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        $sql = "INSERT INTO sellers (firstname, lastname, phone, email, datebirth, storeName, storeAddress, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssssss", $firstname, $lastname, $phone, $email, $dob, $storeName, $storeAddress, $hashedPassword);

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Seller account created successfully!';
        } else {
            $response['success'] = false;
            $response['message'] = 'Error: ' . $stmt->error;
        }

        $stmt->close();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);

$conn->close();
?>