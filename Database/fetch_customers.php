<?php
require 'database.php';

$sql = "SELECT DISTINCT u.user_id, u.firstname, u.lastname, u.email, u.phone 
        FROM users u 
        JOIN orders o ON u.user_id = o.user_id 
        WHERE u.user_type = 'Buyer'";
$result = $conn->query($sql);

$customers = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $customers[] = $row;
    }
}

echo json_encode($customers);

$conn->close();
?>