<?php
require_once '../Database/database.php'; // Ensure this file contains the database connection

$sql = "
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
(1, 1, 2),
(1, 2, 1),
(2, 3, 3),
(2, 4, 1);
";

// Execute the query
if ($conn->multi_query($sql) === TRUE) {
    echo "New cart items inserted successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close(); 