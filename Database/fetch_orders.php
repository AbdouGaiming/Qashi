<?php
require 'database.php';

$sql = "SELECT o.order_id, CONCAT(u.firstname, ' ', u.lastname) AS customer_name, o.order_date, o.total_amount, o.status
        FROM orders o
        JOIN users u ON o.user_id = u.user_id";
$result = $conn->query($sql);

$orders = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
}

echo json_encode($orders);

$conn->close();
