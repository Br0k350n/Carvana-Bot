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

DROP TABLE IF EXISTS `players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `players` (
  `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
  `fName` varchar(100) NOT NULL,
  `lName` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `players`
--

LOCK TABLES `players` WRITE;
/*!40000 ALTER TABLE `players` DISABLE KEYS */;
INSERT INTO `players` VALUES (1,'qui','quibusdam'),(2,'veritatis','vel'),(3,'facilis','earum'),(4,'autem','eum'),(5,'suscipit','adipisci'),(6,'ut','quam'),(7,'est','veniam'),(8,'consequatur','est'),(9,'alias','quia'),(10,'sit','perferendis'),(11,'magnam','eum'),(12,'cum','exercitationem'),(13,'repellendus','ut'),(14,'enim','et'),(15,'ab','doloremque'),(16,'laudantium','enim'),(17,'sed','quia'),(18,'aut','dolore'),(19,'repudiandae','doloremque'),(20,'distinctio','similique'),(21,'vel','odit'),(22,'optio','aliquam'),(23,'quia','voluptas'),(24,'sit','ut'),(25,'in','ratione'),(26,'recusandae','autem'),(27,'nemo','quasi'),(28,'totam','debitis'),(29,'asperiores','quia'),(30,'unde','id'),(31,'repudiandae','et'),(32,'eos','dicta'),(33,'ut','nam'),(34,'nisi','eius'),(35,'sed','exercitationem'),(36,'iste','tempora'),(37,'omnis','et'),(38,'nesciunt','expedita'),(39,'iusto','totam'),(40,'quo','nostrum'),(41,'quaerat','dolor'),(42,'nulla','ut'),(43,'iure','quia'),(44,'consequatur','veniam'),(45,'at','aut'),(46,'nihil','et'),(47,'voluptatem','voluptatem'),(48,'consequuntur','non'),(49,'dolores','vel'),(50,'labore','et'),(51,'occaecati','voluptatem'),(52,'et','saepe'),(53,'tempore','perferendis'),(54,'voluptatem','rerum'),(55,'quae','numquam'),(56,'sequi','saepe'),(57,'distinctio','pariatur'),(58,'assumenda','necessitatibus'),(59,'aut','inventore'),(60,'corrupti','sint'),(61,'quia','autem'),(62,'consectetur','ea'),(63,'vitae','voluptatem'),(64,'nihil','repudiandae'),(65,'tempora','voluptatibus'),(66,'quod','sit'),(67,'sed','earum'),(68,'nostrum','ea'),(69,'sint','accusamus'),(70,'non','pariatur'),(71,'repellat','tenetur'),(72,'dolor','dignissimos'),(73,'illo','quis'),(74,'praesentium','voluptate'),(75,'reiciendis','qui'),(76,'laboriosam','nihil'),(77,'ipsa','eum'),(78,'aspernatur','unde'),(79,'odit','sit'),(80,'ipsa','pariatur'),(81,'quis','libero'),(82,'quae','minima'),(83,'delectus','nam'),(84,'sed','dolor'),(85,'provident','distinctio'),(86,'excepturi','ea'),(87,'qui','quis'),(88,'in','est'),(89,'et','voluptatem'),(90,'aut','ullam'),(91,'quaerat','iure'),(92,'molestias','et'),(93,'sit','iusto'),(94,'quo','voluptatum'),(95,'culpa','harum'),(96,'omnis','tenetur'),(97,'accusantium','excepturi'),(98,'sint','numquam'),(99,'et','voluptatem'),(100,'est','et');
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
