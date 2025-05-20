-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET NAMES utf8 */
;
/*!50503 SET NAMES utf8mb4 */
;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */
;
/*!40103 SET TIME_ZONE='+00:00' */
;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;
-- Dumping database structure for orderfood
CREATE DATABASE IF NOT EXISTS `orderfood`
/*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */
;
USE `orderfood`;
-- Dumping structure for table orderfood.customers
CREATE TABLE IF NOT EXISTS `customers` (
  `phone` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`phone`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
-- Dumping data for table orderfood.customers: ~1 rows (approximately)
INSERT INTO `customers` (`phone`, `name`)
VALUES ('0907767961', 'Thanh Hieu');
-- Dumping structure for table orderfood.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `totalPrice` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(255) NOT NULL,
  `customerPhone` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_c3ffc6892db38431594bd14ddaa` (`customerPhone`),
  CONSTRAINT `FK_c3ffc6892db38431594bd14ddaa` FOREIGN KEY (`customerPhone`) REFERENCES `customers` (`phone`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
-- Dumping data for table orderfood.orders: ~2 rows (approximately)
INSERT INTO `orders` (
    `id`,
    `totalPrice`,
    `created_at`,
    `updated_at`,
    `status`,
    `customerPhone`
  )
VALUES (
    1,
    28800,
    '2025-05-16 03:51:33',
    '2025-05-16 03:51:33',
    'Chờ xử lý',
    '0907767961'
  ),
  (
    2,
    38400,
    '2025-05-16 03:51:51',
    '2025-05-16 03:51:51',
    'Chờ xử lý',
    '0907767961'
  );
-- Dumping structure for table orderfood.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `categoryId` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 26 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
-- Dumping data for table orderfood.products: ~8 rows (approximately)
INSERT INTO `products` (
    `id`,
    `name`,
    `price`,
    `description`,
    `categoryId`,
    `quantity`,
    `image`
  )
VALUES (
    1,
    'Mỳ ý',
    30000,
    'Món: Mỳ ý',
    'Mỳ',
    10,
    'mi_y.png'
  ),
  (
    2,
    'Burger',
    25000,
    'Món: Burger',
    'Bánh mì',
    14,
    'hamburger.png'
  ),
  (
    3,
    'Bánh tráng trộn',
    10000,
    'Món: Bánh tráng trộn',
    'Bánh tráng',
    17,
    'banhtrangtron.png'
  ),
  (
    4,
    'Nước ngọt',
    15000,
    'Món: Nước ngọt',
    'Đồ uống',
    8,
    'cocacola.png'
  ),
  (
    5,
    'Mỳ xào',
    20000,
    'Món: Mỳ xào',
    'Mỳ',
    54,
    'mixao.png'
  ),
  (
    6,
    'Cơm chiên',
    22000,
    'Món: Cơm chiên',
    'Cơm',
    25,
    'comchien.jpg'
  ),
  (
    7,
    'Trà sữa',
    18000,
    'Món: Trà sữa',
    'Đồ uống',
    33,
    'trasua.png'
  ),
  (
    8,
    'Salad',
    35000,
    'Món: Salad',
    'Rau',
    44,
    'salad.jpg'
  ),
  (
    25,
    'Thanh Hieu',
    123,
    '123',
    'Mỳ',
    123,
    '1747378535753-473832430.png'
  );
-- Dumping structure for table orderfood.toppings
CREATE TABLE IF NOT EXISTS `toppings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
-- Dumping data for table orderfood.toppings: ~4 rows (approximately)
INSERT INTO `toppings` (`id`, `name`, `price`, `image`, `quantity`)
VALUES (1, 'Phô mai', 7000, 'cheese.png', 1),
  (2, 'Gà chiên', 7000, 'chickentopping.png', 1),
  (3, 'Trứng', 7000, 'omelette.png', 1);
-- Dumping structure for table orderfood.product_toppings
CREATE TABLE IF NOT EXISTS `product_toppings` (
  `productId` int(11) NOT NULL,
  `toppingId` int(11) NOT NULL,
  PRIMARY KEY (`productId`, `toppingId`),
  KEY `FK_3052efe40108380775230a9fd88` (`toppingId`),
  CONSTRAINT `FK_20fa1408a8fbbedd381f777e85d` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_3052efe40108380775230a9fd88` FOREIGN KEY (`toppingId`) REFERENCES `toppings` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
-- Dumping data for table orderfood.product_toppings: ~6 rows (approximately)
INSERT INTO `product_toppings` (`productId`, `toppingId`)
VALUES (1, 1),
  (1, 2),
  (1, 3),
  (2, 3),
  (3, 2),
  (3, 3),
  (25, 1),
  (25, 2);
-- Dumping structure for table orderfood.detail_orders
CREATE TABLE IF NOT EXISTS `detail_orders` (
  `orderId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `toppingId` int(11) NOT NULL,
  `quantityProduct` int(11) NOT NULL,
  `priceProduct` int(11) NOT NULL,
  `priceTopping` int(11) NOT NULL,
  PRIMARY KEY (`orderId`, `productId`, `toppingId`),
  UNIQUE KEY `IDX_c010ae6921b038d18eabc81bf2` (`orderId`, `productId`, `toppingId`),
  KEY `FK_475a473159f93b0e61444162bc9` (`productId`),
  KEY `FK_f216437eb202db3d892c7110694` (`toppingId`),
  CONSTRAINT `FK_1dc626f5f8f0b98b641fbba3ec4` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_475a473159f93b0e61444162bc9` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_f216437eb202db3d892c7110694` FOREIGN KEY (`toppingId`) REFERENCES `toppings` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
-- Dumping data for table orderfood.detail_orders: ~3 rows (approximately)
INSERT INTO `detail_orders` (
    `orderId`,
    `productId`,
    `toppingId`,
    `quantityProduct`,
    `priceProduct`,
    `priceTopping`
  )
VALUES (1, 3, 2, 1, 10000, 7000),
  (1, 3, 3, 1, 10000, 7000),
  (2, 2, 3, 1, 25000, 7000);
-- Dumping structure for table orderfood.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_fe0bb3f6520ee0469504521e71` (`username`)
) ENGINE = InnoDB AUTO_INCREMENT = 16 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
-- Dumping data for table orderfood.users: ~4 rows (approximately)
INSERT INTO `users` (
    `id`,
    `username`,
    `password`,
    `role`,
    `created_at`,
    `status`,
    `name`
  )
VALUES (
    11,
    'admin',
    '$2b$10$7Jp7jJmBMh0PzjQrcNEjvObA.RcakjEONf8VyQgvIimYW4sJ4ViMS',
    'admin',
    '2025-05-16 13:16:09',
    'Đang hoạt động',
    'hieu'
  ),
  (
    13,
    'abc',
    '$2b$10$3C7uKFjCnHuDxpHBtXtoDuHvKhl5QBW6QdCZcy4GbJEKp6MdXWMyq',
    'admin',
    '2025-05-16 13:59:06',
    'Đang hoạt động',
    'Thanh Hieu'
  ),
  (
    14,
    'vvv',
    '$2b$10$nEI81ld42KIRh2KlP6MO8OUKPndHaMntd.Vd5xYZbUsDXdWreMVCW',
    'manager',
    '2025-05-16 13:59:34',
    'Đang hoạt động',
    'Thanh Hieu'
  ),
  (
    15,
    'abcs',
    '$2b$10$z4pH7ZRI6r4Q3GHyclWxK.zGUjICBEzWHXUY6jDNV49GNnCHZOKwe',
    'accountant',
    '2025-05-16 14:06:27',
    'Đang hoạt động',
    'Thanh Hieu'
  );
/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */
;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */
;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */
;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */
;