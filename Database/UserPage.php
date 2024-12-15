
<?php
require_once 'database.php';

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $firstname = trim($_POST['username']);
    $lastname = trim($_POST['position']);
    $phone = trim($_POST['phone']);
    $email = trim($_POST['email']);
    $dob = trim($_POST['dob']);
    $password = trim($_POST['password']);
    $confirmPassword = trim($_POST['confirmPassword']);

    if ($password !== $confirmPassword) {
        $response['success'] = false;
        $response['message'] = 'Passwords do not match.';
    } else {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        $sql = "INSERT INTO users (firstname, lastname, phone, email, datebirth, password) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssss", $firstname, $lastname, $phone, $email, $dob, $hashedPassword);

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Account created successfully!';
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