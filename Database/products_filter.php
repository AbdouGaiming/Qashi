<?php

require 'database.php';
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "qashi";

$conn = new mysqli($servername, $username, $password, $dbname);

//Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get filter parameters from request
$category = isset($_GET['category']) ? $_GET['category'] : '';
$color = isset($_GET['color']) ? $_GET['color'] : '';
$size = isset($_GET['size']) ? $_GET['size'] : '';

// Prepare SQL query with filters
$sql = "SELECT * FROM products WHERE 1=1";
$params = array();
$types = '';

if ($category != '') {
    $sql .= " AND category = ?";
    $params[] = $category;
    $types .= 's';
}
if ($color != '') {
    $sql .= " AND color = ?";
    $params[] = $color;
    $types .= 's';
}
if ($size != '') {
    $sql .= " AND size = ?";
    $params[] = $size;
    $types .= 's';
}

$stmt = $conn->prepare($sql);
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();

$products = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

//Return JSON response
header('Content-Type: application/json');
echo json_encode($products);

$conn->close();
?>