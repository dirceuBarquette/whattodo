-- MySQL dump 10.11
--
-- Host: localhost    Database: template_whattodo
-- ------------------------------------------------------
-- Server version	5.0.67

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `acl_main_menu_items`
--

DROP TABLE IF EXISTS `acl_main_menu_items`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `acl_main_menu_items` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `label` varchar(50) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `whattodo` varchar(50) NOT NULL,
  `ord` int(5) unsigned NOT NULL,
  `status` int(1) unsigned NOT NULL default '1',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `acl_main_menu_items`
--

LOCK TABLES `acl_main_menu_items` WRITE;
/*!40000 ALTER TABLE `acl_main_menu_items` DISABLE KEYS */;
INSERT INTO `acl_main_menu_items` VALUES (1,'usuários','usuários existentes','usuarios',4,1);
/*!40000 ALTER TABLE `acl_main_menu_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `acl_option_menu_items`
--

DROP TABLE IF EXISTS `acl_option_menu_items`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `acl_option_menu_items` (
  `id` int(32) unsigned NOT NULL auto_increment,
  `id_acl_mmi` int(32) unsigned NOT NULL,
  `label` varchar(50) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `whattodo` varchar(50) NOT NULL,
  `ord` int(10) unsigned NOT NULL default '1',
  `status` int(1) unsigned NOT NULL default '1',
  PRIMARY KEY  (`id`,`id_acl_mmi`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `acl_option_menu_items`
--

LOCK TABLES `acl_option_menu_items` WRITE;
/*!40000 ALTER TABLE `acl_option_menu_items` DISABLE KEYS */;
INSERT INTO `acl_option_menu_items` VALUES (1,1,'usuário','','get_sub_items',1,1);
/*!40000 ALTER TABLE `acl_option_menu_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `option_menu_sub_items`
--

DROP TABLE IF EXISTS `option_menu_sub_items`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `option_menu_sub_items` (
  `id` int(32) unsigned NOT NULL auto_increment,
  `id_acl_mmi` int(32) unsigned NOT NULL,
  `id_acl_omi` int(32) NOT NULL,
  `label` varchar(50) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `whattodo` varchar(50) NOT NULL,
  `ord` int(10) unsigned NOT NULL default '1',
  `meta` varchar(1024) default NULL,
  `status` int(1) unsigned NOT NULL default '1',
  PRIMARY KEY  (`id`,`id_acl_mmi`,`id_acl_omi`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `option_menu_sub_items`
--

LOCK TABLES `option_menu_sub_items` WRITE;
/*!40000 ALTER TABLE `option_menu_sub_items` DISABLE KEYS */;
INSERT INTO `option_menu_sub_items` VALUES (1,3,5,'novo','cria um novo questionário','new_quiz_form',1,NULL,1),(2,3,5,'abrir','abre um questionário','search_quiz_form',2,'{whattodo:\'show_quiz_form\'}',1),(3,3,5,'salvar','salvar um questionário','save_quiz_form',3,'',1),(4,3,5,'salvar como...','salvar um questionário com outro nome','save_as_quiz',4,NULL,1),(5,3,13,'incluir questão','formulário para inclusão de pergunta','new_question',1,NULL,1),(6,3,13,'editar questão','','edit_question',2,NULL,1),(7,3,13,'excluir questão','','remove_question',3,NULL,1),(8,1,2,'Alterar dados','','edit_user_form',1,'{whattodo:\'edit_user_form\'}',1),(9,1,2,'alterar senha','','change_user_password_form',2,'{whattodo:\'change_user_password_form\'}',1),(10,3,13,'renumerar questão','','reorder_question',4,NULL,1),(11,4,15,'cadastrar','','search_quiz_for_answer',1,'{whattodo:\'create_quiz_form\'}',1),(12,4,15,'salvar','','save_quiz_answered_form',1,NULL,1),(13,4,16,'alterar grupo','','search_answered_quiz',1,'',1),(14,1,1,'abrir','','search_user',1,NULL,1),(15,1,1,'novo','','new_user_form',1,NULL,1),(16,1,1,'fechar','','close_user_data',3,NULL,1);
/*!40000 ALTER TABLE `option_menu_sub_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_usuario`
--

DROP TABLE IF EXISTS `tipo_usuario`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `tipo_usuario` (
  `id` int(1) unsigned NOT NULL auto_increment,
  `tipo` varchar(25) NOT NULL,
  `status` int(1) unsigned NOT NULL default '1',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `tipo_usuario`
--

LOCK TABLES `tipo_usuario` WRITE;
/*!40000 ALTER TABLE `tipo_usuario` DISABLE KEYS */;
INSERT INTO `tipo_usuario` VALUES (1,'admin',1),(2,'coordenador',1),(3,'supervisor',1),(4,'pesquisador',1),(5,'grupo',1);
/*!40000 ALTER TABLE `tipo_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `usuarios` (
  `id` int(32) unsigned NOT NULL auto_increment,
  `id_tipo` int(1) unsigned NOT NULL,
  `login` varchar(25) NOT NULL,
  `email` varchar(80) NOT NULL,
  `area` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `status` int(1) unsigned NOT NULL default '1',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `login` (`login`),
  KEY `id_tipo` (`id_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,1,'admin','','','e8d95a51f3af4a3b134bf6bb680a213a',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2009-08-08 18:44:02
