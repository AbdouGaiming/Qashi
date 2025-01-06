-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 06 jan. 2025 à 10:55
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `qashi`
--

-- --------------------------------------------------------

--
-- Structure de la table `carts`
--

CREATE TABLE `carts` (
  `cart_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('Pending','Completed','Cancelled') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(50) DEFAULT NULL,
  `category` enum('men','women','boys','girls') NOT NULL,
  `sub_category` enum('hats','shoes','t-shirts','shirts','jeans','shorts','socks','hoodies','jackets','underwears','dresses','pants','suits','') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `stock`, `category`, `sub_category`, `created_at`, `image_url`) VALUES
(16, 'Product 1', 'Description for Product 1', 10.00, 100, 'men', 'shirts', '2024-12-14 22:53:30', 'image1.jpg'),
(17, 'Product 2', 'Description for Product 2', 20.00, 200, 'women', 'dresses', '2024-12-14 22:53:30', 'image2.jpg'),
(18, 'Product 3', 'Description for Product 3', 30.00, 300, 'boys', 't-shirts', '2024-12-14 22:53:30', 'image3.jpg'),
(19, 'Product 4', 'Description for Product 4', 40.00, 400, 'girls', 'shoes', '2024-12-14 22:53:30', 'image4.jpg'),
(20, 'Product 1', 'Description for Product 1', 10.00, 100, 'men', 'shirts', '2024-12-14 23:02:42', 'image1.jpg'),
(21, 'Product 2', 'Description for Product 2', 20.00, 200, 'women', 'dresses', '2024-12-14 23:02:42', 'image2.jpg'),
(22, 'Product 3', 'Description for Product 3', 30.00, 300, 'boys', 't-shirts', '2024-12-14 23:02:42', 'image3.jpg'),
(23, 'Product 4', 'Description for Product 4', 40.00, 400, 'girls', 'shoes', '2024-12-14 23:02:42', 'image4.jpg'),
(24, 'Product 1', 'Description for Product 1', 10.00, 100, 'men', 'shirts', '2024-12-14 23:05:17', 'image1.jpg'),
(25, 'Product 2', 'Description for Product 2', 20.00, 200, 'women', 'dresses', '2024-12-14 23:05:17', 'image2.jpg'),
(26, 'Product 3', 'Description for Product 3', 30.00, 300, 'boys', 't-shirts', '2024-12-14 23:05:17', 'image3.jpg'),
(27, 'Product 4', 'Description for Product 4', 40.00, 400, 'girls', 'shoes', '2024-12-14 23:05:17', 'image4.jpg');

-- --------------------------------------------------------

--
-- Structure de la table `product_attributes`
--

CREATE TABLE `product_attributes` (
  `attribute_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `attribute_type` enum('color','size','material') NOT NULL,
  `attribute_value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `product_variants`
--

CREATE TABLE `product_variants` (
  `variant_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `stock_quantity` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `stores`
--

CREATE TABLE `stores` (
  `store_id` int(50) NOT NULL,
  `store_name` varchar(50) NOT NULL,
  `store_address` varchar(200) NOT NULL,
  `user_id` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `traffic`
--

CREATE TABLE `traffic` (
  `visit_id` bigint(20) UNSIGNED NOT NULL,
  `visit_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `user_id` int(50) NOT NULL,
  `user_type` enum('Buyer','Seller','Admin') NOT NULL,
  `lastname` varchar(15) NOT NULL,
  `firstname` varchar(25) NOT NULL,
  `datebirth` date NOT NULL,
  `phone` int(10) NOT NULL,
  `email` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`user_id`, `user_type`, `lastname`, `firstname`, `datebirth`, `phone`, `email`, `password`) VALUES
(16, 'Buyer', 'Doe', 'John', '1990-01-01', 1234567890, 'john.doe@example.com', 'password123'),
(17, 'Buyer', 'Smith', 'Jane', '1985-05-15', 2147483647, 'jane.smith@example.com', 'password123'),
(18, 'Seller', 'Brown', 'Charlie', '1980-10-20', 2147483647, 'charlie.brown@example.com', 'password123'),
(19, 'Admin', 'Admin', 'Super', '1975-12-25', 2147483647, 'admin@example.com', 'adminpassword'),
(20, 'Buyer', 'Doe', 'John', '1990-01-01', 1234567890, 'john.doe@example.com', 'password123'),
(21, 'Buyer', 'Smith', 'Jane', '1985-05-15', 2147483647, 'jane.smith@example.com', 'password123'),
(22, 'Seller', 'Brown', 'Charlie', '1980-10-20', 2147483647, 'charlie.brown@example.com', 'password123'),
(23, 'Admin', 'Admin', 'Super', '1975-12-25', 2147483647, 'admin@example.com', 'adminpassword'),
(24, 'Buyer', 'Doe', 'John', '1990-01-01', 1234567890, 'john.doe@example.com', 'password123'),
(25, 'Buyer', 'Smith', 'Jane', '1985-05-15', 2147483647, 'jane.smith@example.com', 'password123'),
(26, 'Seller', 'Brown', 'Charlie', '1980-10-20', 2147483647, 'charlie.brown@example.com', 'password123'),
(27, 'Admin', 'Admin', 'Super', '1975-12-25', 2147483647, 'admin@example.com', 'adminpassword'),
(28, 'Buyer', 'aasz', 'zza', '0000-00-00', 792402863, 'login2@gmail.com', '$2y$10$rJbzG2BS//LGTzLQQ5'),
(29, 'Buyer', 'aasz', 'zza', '0000-00-00', 792402863, 'login3@gmail.com', '$2y$10$wPXf/Dl56jPnwEbsf/xC5uxAm.GA/7x7.Gso/5sPLTRcsgaDsNwnC'),
(30, 'Seller', 'drftgyhuji', 'drfghujik', '2003-11-11', 792408811, 'khb@gmail.com', '$2y$10$2Q8uI40xkWPhhp2T1z0Bo..Uu1ovFgstiFxCi7ifLJOoWpTTP3f/.'),
(31, 'Seller', 'jfgyji', 'rdfthu', '2003-11-11', 765445623, 'Uehdj@gmail.com', '$2y$10$I1bbL6TJR1byVMu5hc/TuOxWBCwRkJpu3WOh5VazIRWEco5zYyfL.'),
(32, 'Seller', 'EsstLname', 'esstName', '0000-00-00', 792409999, 'Esst3@gmail.com', '$2y$10$twg6JYdaGBC1JBizyW20QeKBS20JrF8MNQzlzazghUoCfodG7XJeW');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`cart_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Index pour la table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cart_id` (`cart_id`,`product_id`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Index pour la table `product_attributes`
--
ALTER TABLE `product_attributes`
  ADD PRIMARY KEY (`attribute_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`variant_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`store_id`),
  ADD KEY `test` (`user_id`);

--
-- Index pour la table `traffic`
--
ALTER TABLE `traffic`
  ADD PRIMARY KEY (`visit_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `carts`
--
ALTER TABLE `carts`
  MODIFY `cart_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT pour la table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT pour la table `product_attributes`
--
ALTER TABLE `product_attributes`
  MODIFY `attribute_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `variant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `stores`
--
ALTER TABLE `stores`
  MODIFY `store_id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `traffic`
--
ALTER TABLE `traffic`
  MODIFY `visit_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `product_attributes`
--
ALTER TABLE `product_attributes`
  ADD CONSTRAINT `product_attributes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Contraintes pour la table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Contraintes pour la table `stores`
--
ALTER TABLE `stores`
  ADD CONSTRAINT `store_id` FOREIGN KEY (`store_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `test` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
