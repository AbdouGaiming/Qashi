<?php
require_once 'database.php';

$sql = "
INSERT INTO products (name, description, price, stock, category, sub_category, image_url) VALUES
('Classic T-Shirt', 'A comfortable and stylish t-shirt for everyday wear.', 19.99, 100, 'men', 't-shirts', 'Assets/tshirt.png'),
('Elegant Dress', 'A beautiful dress perfect for any occasion.', 49.99, 50, 'women', 'dresses', 'Assets/dress.png'),
('Kids Sneakers', 'Durable and trendy sneakers for kids.', 29.99, 75, 'boys', 'shoes', 'Assets/sneakers.png'),
('Winter Jacket', 'Warm and cozy jacket for the cold season.', 89.99, 30, 'girls', 'jackets', 'Assets/jacket.png');
";

// Execute the query
if ($conn->multi_query($sql) === TRUE) {
    echo "New products inserted successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
