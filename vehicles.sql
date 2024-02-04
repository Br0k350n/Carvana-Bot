DROP DATABASE IF EXISTS `vehicles_db`;
CREATE DATABASE IF NOT EXISTS `vehicles_db` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci */;
USE `vehicles_db`;

-- Dumping structure for table qbcore.apartments
DROP TABLE IF EXISTS `vehicles`;
CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
  `vehicle` varchar(255) NOT NULL,
  `spawnid` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `processed_orders`;

CREATE TABLE IF NOT EXISTS `processed_orders` (
    `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `license` varchar(255) NOT NULL,
    `citizenid` varchar(255) NOT NULL,
    `vehicle` varchar(255) NOT NULL,
    `spawnid` varchar(255) NOT NULL,
    `plate` varchar(255) NOT NULL,
    `date` varchar(255) NOT NULL,
    `time` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
);

