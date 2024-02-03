-- MariaDB dump 10.19  Distrib 10.6.12-MariaDB, for Linux (x86_64)
--
-- Host: mysql.hostinger.ro    Database: u574849695_25
-- ------------------------------------------------------
-- Server version	10.6.12-MariaDB-cll-lve

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `players`
--
DROP TABLE IF EXISTS `processed_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `processed_orders` (
  `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
  `plateID` varchar(6) NOT NULL,
  `discordID` varchar(100) NULL,
  `steamID` varchar(100) NULL,
  `order_date` DATE,
  `order_time` TIME,
  `importID` varchar(20) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

INSERT INTO `processed_orders` VALUES (1, '000001', 1197315444751728761, '96192841', '2022-08-01', '15:30:45', 115);

DROP TABLE IF EXISTS `imports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `imports` (
  `name` varchar(100) NULL,
  `importID` varchar(20),
  PRIMARY KEY (`importID`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

INSERT INTO `imports` VALUES ('Mustang', 15);

DROP TABLE IF EXISTS `players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `players` (
  `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
  `fName` varchar(100) NOT NULL,
  `lName` varchar(100) NOT NULL,
  `discordID` varchar(100) NULL,
  `steamID` varchar(100) NULL,
  `charID` varchar(100) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `players`
--

LOCK TABLES `players` WRITE;
/*!40000 ALTER TABLE `players` DISABLE KEYS */;
INSERT INTO `players` VALUES (1,'Clive','Rockford', 1197315444751728761, '96192841', 45),(2,'veritatis','vel', 1202387754470604821, '96192740', 45),(3,'facilis','earum', 1202387754470600, '96192740', 45),(4,'autem','eum', 1202387754470600, '96192740', 45),(5,'suscipit','adipisci', 1202387754470600, '96192740', 45),(6,'ut','quam', 1202387754470600, '96192740', 45),(7,'est','veniam', 1202387754470600, '96192740', 45),(8,'consequatur','est', 1202387754470600, '96192740', 45),(9,'alias','quia', 1202387754470600, '96192740', 45),(10,'sit','perferendis', 1202387754470600, '96192740', 45),(11,'magnam','eum', 1202387754470600, '96192740', 45),(12,'cum','exercitationem', 1202387754470600, '96192740', 45),(13,'repellendus','ut', 1202387754470600, '96192740', 45),(14,'enim','et', 1202387754470600, '96192740', 45),(15,'ab','doloremque', 1202387754470600, '96192740', 45),(16,'laudantium','enim', 1202387754470600, '96192740', 45),(17,'sed','quia', 1202387754470600, '96192740', 45),(18,'aut','dolore', 1202387754470600, '96192740', 45),(19,'repudiandae','doloremque', 1202387754470600, '96192740', 45),(20,'distinctio','similique', 1202387754470600, '96192740', 45),(21,'vel','odit', 1202387754470600, '96192740', 45),(22,'optio','aliquam', 1202387754470600, '96192740', 45),(23,'quia','voluptas', 1202387754470600, '96192740', 45),(24,'sit','ut', 1202387754470600, '96192740', 45),(25,'in','ratione', 1202387754470600, '96192740', 45),(26,'recusandae','autem', 1202387754470600, '96192740', 45),(27,'nemo','quasi', 1202387754470600, '96192740', 45),(28,'totam','debitis', 1202387754470600, '96192740', 45),(29,'asperiores','quia', 1202387754470600, '96192740', 45),(30,'unde','id', 1202387754470600, '96192740', 45),(31,'repudiandae','et', 1202387754470600, '96192740', 45),(32,'eos','dicta', 1202387754470600, '96192740', 45),(33,'ut','nam', 1202387754470600, '96192740', 45),(34,'nisi','eius', 1202387754470600, '96192740', 45),(35,'sed','exercitationem', 1202387754470600, '96192740', 45),(36,'iste','tempora', 1202387754470600, '96192740', 45),(37,'omnis','et', 1202387754470600, '96192740', 45),(38,'nesciunt','expedita', 1202387754470600, '96192740', 45),(39,'iusto','totam', 1202387754470600, '96192740', 45),(40,'quo','nostrum', 1202387754470600, '96192740', 45),(41,'quaerat','dolor', 1202387754470600, '96192740', 45),(42,'nulla','ut', 1202387754470600, '96192740', 45),(43,'iure','quia', 1202387754470600, '96192740', 45),(44,'consequatur','veniam', 1202387754470600, '96192740', 45),(45,'at','aut', 1202387754470600, '96192740', 45),(46,'nihil','et', 1202387754470600, '96192740', 45),(47,'voluptatem','voluptatem', 1202387754470600, '96192740', 45),(48,'consequuntur','non', 1202387754470600, '96192740', 45),(49,'dolores','vel', 1202387754470600, '96192740', 45),(50,'labore','et', 1202387754470600, '96192740', 45),(51,'occaecati','voluptatem', 1202387754470600, '96192740', 45),(52,'et','saepe', 1202387754470600, '96192740', 45),(53,'tempore','perferendis', 1202387754470600, '96192740', 45),(54,'voluptatem','rerum', 1202387754470600, '96192740', 45),(55,'quae','numquam', 1202387754470600, '96192740', 45),(56,'sequi','saepe', 1202387754470600, '96192740', 45),(57,'distinctio','pariatur', 1202387754470600, '96192740', 45),(58,'assumenda','necessitatibus', 1202387754470600, '96192740', 45),(59,'aut','inventore', 1202387754470600, '96192740', 45),(60,'corrupti','sint', 1202387754470600, '96192740', 45),(61,'quia','autem', 1202387754470600, '96192740', 45),(62,'consectetur','ea', 1202387754470600, '96192740', 45),(63,'vitae','voluptatem', 1202387754470600, '96192740', 45),(64,'nihil','repudiandae', 1202387754470600, '96192740', 45),(65,'tempora','voluptatibus', 1202387754470600, '96192740', 45),(66,'quod','sit', 1202387754470600, '96192740', 45),(67,'sed','earum', 1202387754470600, '96192740', 45),(68,'nostrum','ea', 1202387754470600, '96192740', 45),(69,'sint','accusamus', 1202387754470600, '96192740', 45),(70,'non','pariatur', 1202387754470600, '96192740', 45),(71,'repellat','tenetur', 1202387754470600, '96192740', 45),(72,'dolor','dignissimos', 1202387754470600, '96192740', 45),(73,'illo','quis', 1202387754470600, '96192740', 45),(74,'praesentium','voluptate', 1202387754470600, '96192740', 45),(75,'reiciendis','qui', 1202387754470600, '96192740', 45),(76,'laboriosam','nihil', 1202387754470600, '96192740', 45),(77,'ipsa','eum', 1202387754470600, '96192740', 45),(78,'aspernatur','unde', 1202387754470600, '96192740', 45),(79,'odit','sit', 1202387754470600, '96192740', 45),(80,'ipsa','pariatur', 1202387754470600, '96192740', 45),(81,'quis','libero', 1202387754470600, '96192740', 45),(82,'quae','minima', 1202387754470600, '96192740', 45),(83,'delectus','nam', 1202387754470600, '96192740', 45),(84,'sed','dolor', 1202387754470600, '96192740', 45),(85,'provident','distinctio', 1202387754470600, '96192740', 45),(86,'excepturi','ea', 1202387754470600, '96192740', 45),(87,'qui','quis', 1202387754470600, '96192740', 45),(88,'in','est', 1202387754470600, '96192740', 45),(89,'et','voluptatem', 1202387754470600, '96192740', 45),(90,'aut','ullam', 1202387754470600, '96192740', 45),(91,'quaerat','iure', 1202387754470600, '96192740', 45),(92,'molestias','et', 1202387754470600, '96192740', 45),(93,'sit','iusto', 1202387754470600, '96192740', 45),(94,'quo','voluptatum', 1202387754470600, '96192740', 45),(95,'culpa','harum', 1202387754470600, '96192740', 45),(96,'omnis','tenetur', 1202387754470600, '96192740', 45),(97,'accusantium','excepturi', 1202387754470600, '96192740', 45),(98,'sint','numquam', 1202387754470600, '96192740', 45),(99,'et','voluptatem', 1202387754470600, '96192740', 45),(100,'est','et', 1202387754470600, '96192740', 45);
/*!40000 ALTER TABLE `players` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-01 20:05:28
