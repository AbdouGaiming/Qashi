SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `carts` (
  `cart_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `cart_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(50) DEFAULT NULL,
  `category` enum('men','women','boys','girls') NOT NULL,
  `sub_category` enum('hats','shoes','t-shirts','shirts','jeans','shorts','socks','hoodies','jackets','underwears','dresses','pants','suits') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `product_attributes` (
  `attribute_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `attribute_type` enum('color','size','material') NOT NULL,
  `attribute_value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `product_variants` (
  `variant_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `stock_quantity` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `orders` (
  `order_id` BIGINT(20) UNSIGNED NOT NULL,
  `user_id` INT(11) NOT NULL,
  `order_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('Pending','Completed','Cancelled') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `order_items` (
  `id` BIGINT(20) UNSIGNED NOT NULL,
  `order_id` BIGINT(20) UNSIGNED NOT NULL,
  `product_id` INT(11) NOT NULL,
  `quantity` INT(11) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `stores` (
  `store_id` int(50) NOT NULL,
  `store_name` varchar(50) NOT NULL,
  `store_address` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_type` enum('Buyer','Seller','Admin') NOT NULL,
  `lastname` varchar(15) NOT NULL,
  `firstname` varchar(25) NOT NULL,
  `datebirth` date NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `traffic` (
  `visit_id` BIGINT(20) UNSIGNED NOT NULL,
  `visit_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`visit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `carts`
  ADD PRIMARY KEY (`cart_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cart_id` (`cart_id`,`product_id`);

ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

ALTER TABLE `product_attributes`
  ADD PRIMARY KEY (`attribute_id`),
  ADD KEY `product_id` (`product_id`);

ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`variant_id`),
  ADD KEY `product_id` (`product_id`);

ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

ALTER TABLE `stores`
  ADD PRIMARY KEY (`store_id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

ALTER TABLE `carts`
  MODIFY `cart_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `product_attributes`
  MODIFY `attribute_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `product_variants`
  MODIFY `variant_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `orders`
  MODIFY `order_id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `order_items`
  MODIFY `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `stores`
  MODIFY `store_id` int(50) NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

ALTER TABLE `product_attributes`
  ADD CONSTRAINT `product_attributes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

ALTER TABLE `stores`
  ADD CONSTRAINT `store_id` FOREIGN KEY (`store_id`) REFERENCES `users` (`user_id`);

COMMIT;

-- Insert sample data into users table
INSERT INTO `users` (`user_type`, `lastname`, `firstname`, `datebirth`, `phone`, `email`, `password`) VALUES
('Buyer', 'Doe', 'John', '1990-01-01', '1234567890', 'john.doe@example.com', 'password123'),
('Buyer', 'Smith', 'Jane', '1985-05-15', '2345678901', 'jane.smith@example.com', 'password123'),
('Seller', 'Brown', 'Charlie', '1980-10-20', '3456789012', 'charlie.brown@example.com', 'password123'),
('Admin', 'Admin', 'Super', '1975-12-25', '4567890123', 'admin@example.com', 'adminpassword');

-- Insert sample data into products table
INSERT INTO `products` (`name`, `description`, `price`, `stock`, `category`, `sub_category`, `image_url`) VALUES
('Product 1', 'Description for Product 1', 10.00, 100, 'men', 'shirts', 'image1.jpg'),
('Product 2', 'Description for Product 2', 20.00, 200, 'women', 'dresses', 'image2.jpg'),
('Product 3', 'Description for Product 3', 30.00, 300, 'boys', 't-shirts', 'image3.jpg'),
('Product 4', 'Description for Product 4', 40.00, 400, 'girls', 'shoes', 'image4.jpg');

-- Insert sample data into product_variants table
INSERT INTO `product_variants` (`product_id`, `color`, `size`, `stock_quantity`) VALUES
(1, 'Red', 'M', 50),
(1, 'Blue', 'L', 50),
(2, 'Green', 'S', 100),
(3, 'Yellow', 'XL', 150),
(4, 'Black', 'M', 200);

-- Insert sample data into orders table
INSERT INTO `orders` (`user_id`, `order_date`, `total_amount`, `status`) VALUES
(1, '2023-10-01 10:00:00', 100.00, 'Completed'),
(2, '2023-10-02 11:00:00', 200.00, 'Pending'),
(1, '2023-10-03 12:00:00', 150.00, 'Completed'),
(2, '2023-10-04 13:00:00', 250.00, 'Cancelled');

-- Insert sample data into order_items table
INSERT INTO `order_items` (`order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 2, 10.00),
(1, 2, 1, 20.00),
(2, 3, 3, 30.00),
(3, 4, 4, 40.00),
(4, 1, 1, 10.00);

-- Insert sample data into carts table
INSERT INTO `carts` (`user_id`, `created_at`) VALUES
(1, '2023-10-01 10:00:00'),
(2, '2023-10-02 11:00:00');

-- Insert sample data into cart_items table
INSERT INTO `cart_items` (`cart_id`, `product_id`, `quantity`) VALUES
(1, 1, 2),
(1, 2, 1),
(2, 3, 3),
(2, 4, 4);

-- Insert sample data into traffic table
INSERT INTO `traffic` (`visit_date`) VALUES
('2023-10-01 10:00:00'),
('2023-10-02 11:00:00'),
('2023-10-03 12:00:00'),
('2023-10-04 13:00:00');
