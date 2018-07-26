-- MySQL dump 10.13  Distrib 5.7.11, for Win64 (x86_64)
--
-- Host: localhost    Database: test
-- ------------------------------------------------------
-- Server version	5.7.11

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
-- Table structure for table `assign_record`
--

DROP TABLE IF EXISTS `assign_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assign_record` (
  `id` varchar(36) DEFAULT NULL COMMENT '主键',
  `customer_id` varchar(36) DEFAULT NULL COMMENT '客户ID',
  `customer_conn_id` varchar(36) DEFAULT NULL COMMENT '客户连接ID',
  `supporter_id` varchar(36) DEFAULT NULL COMMENT '客服ID',
  `supporter_conn_id` varchar(36) DEFAULT NULL COMMENT '客服连接ID',
  `assign_time` datetime DEFAULT NULL COMMENT '分配时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assign_record`
--

LOCK TABLES `assign_record` WRITE;
/*!40000 ALTER TABLE `assign_record` DISABLE KEYS */;
INSERT INTO `assign_record` VALUES ('ce9626adee234c599c8af68f775b42b3',NULL,'9D9857430E9DF5912AF210625059D512',NULL,'7BAFAAA2597550F8979D46BBA103CDA3','2018-06-09 21:01:26'),('4cad19134406483fa1ca7731245ed0ec',NULL,'F3435CAC7CC78989F00E657759E26077',NULL,'7BAFAAA2597550F8979D46BBA103CDA3','2018-06-09 21:02:39'),('b82b884e57ca41518c74d61ba4fdd79e',NULL,'F3435CAC7CC78989F00E657759E26077',NULL,'17388A3CE4B2CEF431247F7D1595ADBA','2018-06-09 21:02:41'),('cad6bf0597114709b6f7c18078e17722',NULL,'A5711E30359A8C9223E576A6C98ACE17',NULL,'17388A3CE4B2CEF431247F7D1595ADBA','2018-06-09 21:06:53'),('43fa300581be42c89ce76f5afc66e365',NULL,'918E963CCF4F78DF943BDA5E77F6AFD4',NULL,'17388A3CE4B2CEF431247F7D1595ADBA','2018-06-09 21:10:39'),('42644280b7be4b5f9de94d4e67b0c31d',NULL,'B8DBCBC6C70518381EA0FCD07D589050',NULL,'11E26C39D243D106357929D762EBA4E9','2018-06-09 21:12:05');
/*!40000 ALTER TABLE `assign_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authorities`
--

DROP TABLE IF EXISTS `authorities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `authorities` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `authority` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authorities`
--

LOCK TABLES `authorities` WRITE;
/*!40000 ALTER TABLE `authorities` DISABLE KEYS */;
INSERT INTO `authorities` VALUES (5,'admin','manager'),(6,'admin','op_createuser'),(7,'admin','admin');
/*!40000 ALTER TABLE `authorities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `connection_record`
--

DROP TABLE IF EXISTS `connection_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `connection_record` (
  `id` varchar(36) NOT NULL COMMENT '主键',
  `client_address` varchar(128) NOT NULL COMMENT '客户端地址',
  `server_address` varchar(128) NOT NULL COMMENT '服务端地址',
  `type` char(255) NOT NULL COMMENT '连接类型(0:客户连接，1:客服连接)',
  `status` char(255) NOT NULL COMMENT '连接状态(0:连接中，1:已断开)',
  `user_id` varchar(36) DEFAULT NULL COMMENT '用户id',
  `open_time` datetime NOT NULL COMMENT '打开时间',
  `close_time` datetime DEFAULT NULL COMMENT '关闭时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `connection_record`
--

LOCK TABLES `connection_record` WRITE;
/*!40000 ALTER TABLE `connection_record` DISABLE KEYS */;
INSERT INTO `connection_record` VALUES ('03333CD8AF0A42EFF88651B770974A7D','127.0.0.1','127.0.0.1','1','0',NULL,'2018-06-09 15:37:18',NULL),('11E26C39D243D106357929D762EBA4E9','127.0.0.1','127.0.0.1','1','0',NULL,'2018-06-09 21:11:57',NULL),('12FC90814F3A71692577947AEA1AB511','127.0.0.1','127.0.0.1','1','0',NULL,'2018-06-09 15:37:16',NULL),('1712EB280F3A6AE57B4A407492CF7432','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','1','1',NULL,'2018-06-09 12:15:39','2018-06-09 12:16:04'),('17388A3CE4B2CEF431247F7D1595ADBA','127.0.0.1','127.0.0.1','1','0',NULL,'2018-06-09 21:02:40',NULL),('1BB6120BC000024471C33B2CDB527C79','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','1','1',NULL,'2018-06-09 12:11:16','2018-06-09 12:12:31'),('23103ABE61947AA7C086EA7EE290055A','127.0.0.1','127.0.0.1','1','1',NULL,'2018-06-09 15:42:53','2018-06-09 15:45:29'),('289DE2E42F422CBCC214F68A54601AF4','127.0.0.1','127.0.0.1','0','1',NULL,'2018-06-09 20:56:38','2018-06-09 21:01:25'),('2FED2420EFE46E5DB5893D8B86D7C765','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','1','1',NULL,'2018-06-09 12:15:48','2018-06-09 12:16:13'),('2FEF027AB50E9F511C8142F1746165E9','127.0.0.1','127.0.0.1','1','1',NULL,'2018-06-09 15:39:51','2018-06-09 15:40:03'),('308F71FE1CF94C94A637972F151DE44A','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','1','0',NULL,'2018-06-09 12:16:10',NULL),('31F573E1AC634045B6D063F21C5B55E6','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','1','1',NULL,'2017-05-08 16:37:54','2017-05-08 16:38:36'),('359C1951852E4BA0A82F633226F29183','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','1','1',NULL,'2018-06-09 12:09:54','2018-06-09 12:11:27'),('3CF46E7621EF3636543A6DC59562D2CE','127.0.0.1','127.0.0.1','1','1',NULL,'2018-06-09 15:39:40','2018-06-09 15:39:51'),('3E78EB6C0126FA7AB78192C10F423821','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','1','1',NULL,'2018-06-09 12:15:57','2018-06-09 12:16:22'),('3EC2798FCCD6EB8728EEABE34E851B42','127.0.0.1','127.0.0.1','1','0',NULL,'2018-06-09 15:50:44',NULL),('42543997B4577E057BEE35A9C759B6EE','127.0.0.1','127.0.0.1','1','0',NULL,'2018-06-09 15:57:34',NULL),('4433CA76213AE83DD9D6C6EAAC3B2D18','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','1','0',NULL,'2017-05-08 16:38:38',NULL),('49BAEAD818450A34E33DAB223260DF25','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','1','1',NULL,'2018-06-09 12:04:44','2018-06-09 12:05:28'),('50A83586998A30FBD9332D0FE8B9A0BC','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','1','1',NULL,'2017-05-08 16:37:55','2017-05-08 16:39:10'),('5A42A44AFA8D2130DF77E3510DFAFBAB','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','1','1',NULL,'2018-06-09 12:19:01','2018-06-09 12:19:27'),('76B974C9394B1B81DF5B156FE3B8CEC1','127.0.0.1','127.0.0.1','1','1',NULL,'2018-06-09 15:42:32','2018-06-09 15:42:41'),('777D62555D2A2986FED4334C7E077545','127.0.0.1','127.0.0.1','1','1',NULL,'2018-06-09 15:45:29','2018-06-09 15:45:51'),('7B3B798277BB81E40AF1780B136A49E9','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','1','0',NULL,'2018-06-09 12:19:10',NULL),('7BAFAAA2597550F8979D46BBA103CDA3','127.0.0.1','127.0.0.1','1','1',NULL,'2018-06-09 20:55:51','2018-06-09 21:02:40'),('7F6C1475BF2E500A18EFC148F8BBD3E5','127.0.0.1','127.0.0.1','1','1',NULL,'2018-06-09 15:50:43','2018-06-09 15:50:44'),('85AAD675657788C0795A98607AD5544F','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','1','1',NULL,'2018-06-09 12:03:26','2018-06-09 12:03:50'),('918E963CCF4F78DF943BDA5E77F6AFD4','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','0','1',NULL,'2018-06-09 21:10:38','2018-06-09 21:11:29'),('944D461FCD700F4DD975F5F81DE4A4E5','127.0.0.1','127.0.0.1','1','0',NULL,'2018-06-09 15:37:19',NULL),('9D9857430E9DF5912AF210625059D512','127.0.0.1','127.0.0.1','0','1',NULL,'2018-06-09 21:01:25','2018-06-09 21:02:38'),('A5711E30359A8C9223E576A6C98ACE17','127.0.0.1','127.0.0.1','0','0',NULL,'2018-06-09 21:06:53',NULL),('A9DA9842FBDCD679F322B40716CC3C61','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','1','1',NULL,'2018-06-09 15:23:49','2018-06-09 15:37:09'),('AE05CB076FF8A735DF6566824A2C6A37','127.0.0.1','127.0.0.1','1','0',NULL,'2018-06-09 15:37:14',NULL),('B42455E4E6C422CF1CEC4B73FF8F4DB7','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','1','1',NULL,'2018-06-09 21:10:43','2018-06-09 21:11:08'),('B8DBCBC6C70518381EA0FCD07D589050','127.0.0.1','127.0.0.1','0','0',NULL,'2018-06-09 21:12:05',NULL),('BAE13D5DA7604C383D349A43F17BBA7F','127.0.0.1','127.0.0.1','1','1',NULL,'2018-06-09 15:42:41','2018-06-09 15:42:52'),('BB868A148127B27805C09A0675DABC40','127.0.0.1','127.0.0.1','1','1',NULL,'2018-06-09 15:39:20','2018-06-09 15:39:30'),('C34C08F41116BAB08B8A6C4C48CC42E2','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','1','1',NULL,'2018-06-09 12:03:51','2018-06-09 12:03:53'),('C444D3964FAA19040C9490C376645416','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','1','1',NULL,'2018-06-09 21:10:59','2018-06-09 21:11:24'),('DB9CAA3E643F013844DA807A74649764','127.0.0.1','127.0.0.1','1','1',NULL,'2018-06-09 15:37:17','2018-06-09 15:37:17'),('E32E9E6F7E9B7DBB62FFE14953369C2E','127.0.0.1','127.0.0.1','0','0',NULL,'2018-06-09 15:50:13',NULL),('EB230720BC86E68726552F1C4BD3EF16','0:0:0:0:0:0:0:1','0:0:0:0:0:0:0:1','1','1',NULL,'2018-06-09 12:21:36','2018-06-09 12:21:39'),('F3435CAC7CC78989F00E657759E26077','127.0.0.1','127.0.0.1','0','1',NULL,'2018-06-09 21:02:38','2018-06-09 21:06:50'),('FF96EEBE5A7BBC2517DCA7BB57E456EA','127.0.0.1','127.0.0.1','1','1',NULL,'2018-06-09 15:48:54','2018-06-09 15:50:42');
/*!40000 ALTER TABLE `connection_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluation`
--

DROP TABLE IF EXISTS `evaluation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `evaluation` (
  `id` varchar(36) DEFAULT NULL COMMENT '主键',
  `customer_id` varchar(36) DEFAULT NULL COMMENT '客户ID',
  `customer_conn_id` varchar(36) DEFAULT NULL COMMENT '客户连接ID',
  `score` int(1) DEFAULT NULL COMMENT '分数',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluation`
--

LOCK TABLES `evaluation` WRITE;
/*!40000 ALTER TABLE `evaluation` DISABLE KEYS */;
/*!40000 ALTER TABLE `evaluation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faq`
--

DROP TABLE IF EXISTS `faq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `faq` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `summary` varchar(255) DEFAULT NULL COMMENT '标题',
  `url` varchar(255) DEFAULT NULL COMMENT '资源地址',
  `status` char(255) DEFAULT NULL COMMENT '状态（0：正常，1：失效）',
  `remarks` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faq`
--

LOCK TABLES `faq` WRITE;
/*!40000 ALTER TABLE `faq` DISABLE KEYS */;
/*!40000 ALTER TABLE `faq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persistent_logins`
--

DROP TABLE IF EXISTS `persistent_logins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `persistent_logins` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `username` varchar(50) DEFAULT '' COMMENT '用户名',
  `series` varchar(50) DEFAULT '' COMMENT 'series',
  `token` varchar(64) DEFAULT '' COMMENT 'tokenValue',
  `last_used` datetime DEFAULT NULL COMMENT 'last_used',
  KEY `id` (`id`),
  KEY `series` (`series`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persistent_logins`
--

LOCK TABLES `persistent_logins` WRITE;
/*!40000 ALTER TABLE `persistent_logins` DISABLE KEYS */;
INSERT INTO `persistent_logins` VALUES (2,'admin2','Xq7MNv2JWg/1/t4Q2irznw==','NXjcqBVYEHfNQoQmy3INtw==','2017-03-22 13:59:26'),(3,'admin2','W5mmwWakwEYTffUVFHfTKg==','UuXpZ4xzILO/VSaq+pH28w==','2017-03-22 14:04:51'),(4,'admin2','qB1Tkyy9WVo4AcRLo5bnmQ==','d5dCjQ+Wj3r2A8FUuWOXyA==','2017-03-22 14:10:00');
/*!40000 ALTER TABLE `persistent_logins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_order`
--

DROP TABLE IF EXISTS `question_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question_order` (
  `id` varchar(32) NOT NULL COMMENT '主键（UUID）',
  `create_time` datetime DEFAULT NULL COMMENT '创建日起',
  `create_user` varchar(32) DEFAULT NULL COMMENT '提交人',
  `solved_time` datetime DEFAULT NULL COMMENT '工单处理时间',
  `state` tinyint(2) DEFAULT NULL COMMENT '0:已创建；1:待处理；2：处理中；3：已处理；4：已解决；',
  `question_type` tinyint(2) DEFAULT NULL COMMENT '0:通用类型;1:其他类型',
  `question_summary` varchar(128) DEFAULT NULL COMMENT '问题概述',
  `question_content` varchar(2000) DEFAULT NULL COMMENT '问题内容',
  `email` varchar(64) DEFAULT NULL COMMENT '联系邮箱账号',
  `accept` varchar(32) DEFAULT NULL COMMENT '受理人',
  PRIMARY KEY (`id`),
  KEY `create_user` (`create_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工单表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_order`
--

LOCK TABLES `question_order` WRITE;
/*!40000 ALTER TABLE `question_order` DISABLE KEYS */;
INSERT INTO `question_order` VALUES ('42b22f1aa18c47d29d104a7e48ec54fc','2018-06-09 11:51:40',NULL,NULL,0,0,'都行','我想提一个问题',NULL,NULL),('7fcf8ed5bb224607b05d97664fbc253d','2018-07-20 22:18:42','admin',NULL,2,1,'','23132','1512',NULL),('d42b150fc31349c5873e73a735b389a4','2018-06-09 23:05:34',NULL,NULL,0,0,'都行','我想提一个问题',NULL,NULL),('ff31496635b54d65aed5e6824862ce96','2017-05-09 09:42:29','hf',NULL,2,1,'','ces ','ca',NULL);
/*!40000 ALTER TABLE `question_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_order_attachment`
--

DROP TABLE IF EXISTS `question_order_attachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question_order_attachment` (
  `id` varchar(32) NOT NULL COMMENT 'id',
  `question_order_id` varchar(32) DEFAULT NULL COMMENT '问题工单ID',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `status` tinyint(2) DEFAULT NULL COMMENT '状态 0:已创建；1：已删除',
  `url` varchar(256) DEFAULT NULL COMMENT '工单地址',
  PRIMARY KEY (`id`),
  KEY `question_order_id` (`question_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工单附件';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_order_attachment`
--

LOCK TABLES `question_order_attachment` WRITE;
/*!40000 ALTER TABLE `question_order_attachment` DISABLE KEYS */;
INSERT INTO `question_order_attachment` VALUES ('60274aa638d648a892a6894d2598a1c1','ff31496635b54d65aed5e6824862ce96','2017-05-09 09:42:30',1,'201705/f695c71100774a40a04029a685b70be1.jpg'),('6d526fb65e774ee091414a7e3348f151','ff31496635b54d65aed5e6824862ce96','2017-05-09 09:42:30',1,'201705/94d2e05caf70444c985195199b584450.jpg'),('8cf41f7e2d7f48cc8f7f8fe163970204','d42b150fc31349c5873e73a735b389a4','2018-06-09 23:05:34',1,'aa'),('bcbe829059274181879033a7571fbd9c','ff31496635b54d65aed5e6824862ce96','2017-05-09 09:42:30',1,'201705/a5b95df1add74e3ab26ecbe6cb8b41c6.jpg'),('eedd6c2a5d584f70a994c1fedb7c6370','42b22f1aa18c47d29d104a7e48ec54fc','2018-06-09 11:51:40',1,'aa');
/*!40000 ALTER TABLE `question_order_attachment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_record`
--

DROP TABLE IF EXISTS `question_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question_record` (
  `id` varchar(32) NOT NULL COMMENT 'id',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `content` varchar(1000) DEFAULT NULL COMMENT '交谈内容',
  `commit_user` varchar(32) DEFAULT NULL COMMENT '提交人',
  `userType` tinyint(2) DEFAULT NULL COMMENT '0 用户 1管理员',
  `question_order_id` varchar(32) DEFAULT NULL COMMENT '工单id',
  PRIMARY KEY (`id`),
  KEY `commit_user` (`commit_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工单';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_record`
--

LOCK TABLES `question_record` WRITE;
/*!40000 ALTER TABLE `question_record` DISABLE KEYS */;
INSERT INTO `question_record` VALUES ('06cffd26cc4f4b618e26f894f270ac21','2017-05-09 09:54:26','fdsa','hf',0,'ff31496635b54d65aed5e6824862ce96'),('5','2018-06-09 12:00:32','aaaa','user',1,'1');
/*!40000 ALTER TABLE `question_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_dictionaries`
--

DROP TABLE IF EXISTS `sys_dictionaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_dictionaries` (
  `id` varchar(32) NOT NULL COMMENT 'id',
  `tname` varchar(50) DEFAULT '' COMMENT '类型',
  `createTime` datetime DEFAULT NULL COMMENT '创建日期',
  `dtype` varchar(15) DEFAULT NULL COMMENT '字典Key',
  `tindex` int(11) DEFAULT NULL COMMENT '索引',
  PRIMARY KEY (`id`),
  UNIQUE KEY `dtype` (`dtype`,`tindex`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_dictionaries`
--

LOCK TABLES `sys_dictionaries` WRITE;
/*!40000 ALTER TABLE `sys_dictionaries` DISABLE KEYS */;
INSERT INTO `sys_dictionaries` VALUES ('1','Information','2017-04-24 15:29:48','orderType',1),('2','Other','2017-04-24 15:31:33','orderType',2),('3','TobeAccepted','2017-04-24 16:17:51','orderState',1),('4','Accepted','2017-04-24 16:15:34','orderState',2),('5','Confirm','2017-04-24 16:17:29','orderState',3);
/*!40000 ALTER TABLE `sys_dictionaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `talk_record`
--

DROP TABLE IF EXISTS `talk_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `talk_record` (
  `id` varchar(36) NOT NULL COMMENT '主键',
  `content` varchar(500) NOT NULL COMMENT '提问内容',
  `user_id` varchar(36) DEFAULT NULL COMMENT '用户ID',
  `user_type` char(255) NOT NULL COMMENT '用户类型（0：客户，1：客服）',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `connection_id` varchar(36) NOT NULL COMMENT '连接ID',
  `reply` varchar(500) DEFAULT NULL COMMENT '回复内容',
  `replyType` tinyint(2) DEFAULT NULL COMMENT '1找到内容',
  `groupId` varchar(20) DEFAULT NULL COMMENT 'QQ群ID',
  `questionId` varchar(36) DEFAULT NULL COMMENT '问题ID',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `groupId` (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='沟通记录';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `talk_record`
--

LOCK TABLES `talk_record` WRITE;
/*!40000 ALTER TABLE `talk_record` DISABLE KEYS */;
INSERT INTO `talk_record` VALUES ('008b177bfd8747adb0e92a977c7c2689','mysql','834865081','','2018-06-09 22:55:33','','很抱歉，我还不知道答案 群里知道此问题答案的请 @机器猫 @提问者 建议答案：xxxxx',0,'0',''),('01e491fda2264733b5fa015b2e138320','123456','0','','2018-06-13 22:17:20','ba4932f9c1304039b3fdf82f832e944c','789101112 by：J2men',1,'0','beb8d29ac3884f7db21740dd73eaf7ae'),('05ba365ef9eb4eb99ac6873b21896529','黄金的实物交易是什么？','admin','','2018-06-13 22:49:53','','黄金的实物交易一般是去银行或者金店买实物黄金，比如金条，金币，首饰等，实物黄金一般都是去银行购买金条，然后坐等升值，只有升值才能盈利，具体去银行购买就可以了，然后可以存在银行，这样很方便，但是每年大概需要交300元的报关费，银行回收是不收取任何手续费的这个比较简单。实物黄金买卖包括金条、金币和金饰等交易，以持有黄金作为投资。可以肯定其投资额较高，实质回报率虽与其他方法相同，但涉及的金额一定会较低(因为投资的资金不会发挥杠杆效应)，而且只可以在金价上升之时才可以获利。一般的饰金买入及卖出价的差额较大，视作投资并不适宜，金条及金币由于不涉及其他成本，是实金投资的最佳选择。但需要注意的是持有黄金并不会产生利息收益。',1,NULL,NULL),('0be107f321c9401a96437ede08dea248','无语','admin','','2018-06-13 22:28:42','','因为你是傻子',1,NULL,NULL),('0da5c015af70457786a05f54c93ee8ff','string','834865081','','2018-06-09 22:52:11','','很抱歉，我还不知道答案 群里知道此问题答案的请 @机器猫 @提问者 建议答案：xxxxx',0,'0',''),('18c439a723a54139a2257d56a43c58c2','123','admin','','2018-06-12 23:59:45','','请重新描述您的问题',0,NULL,NULL),('195a310c7e904452b6163201a4e5dc30','你','admin','','2018-06-13 22:23:57','','你好 有话就说 有屁就放',1,NULL,NULL),('1ab01b985a8e460f833d1d5518f517ae','123','0','','2018-06-12 23:10:04','','很抱歉，我还不知道答案 群里知道此问题答案的请 @机器猫 @提问者 建议答案：xxxxx',0,'0',''),('23d5b36878f847b2bb5c565d316c0ef9','你是','admin','','2018-07-20 22:18:16','','你好 有话就说 有屁就放',1,NULL,NULL),('27b98be0b9be481b9753f7167f905386','黄金怎么投资','admin','','2018-07-20 22:20:03','','黄金的实物交易一般是去银行或者金店买实物黄金，比如金条，金币，首饰等，实物黄金一般都是去银行购买金条，然后坐等升值，只有升值才能盈利，具体去银行购买就可以了，然后可以存在银行，这样很方便，但是每年大概需要交300元的报关费，银行回收是不收取任何手续费的这个比较简单。实物黄金买卖包括金条、金币和金饰等交易，以持有黄金作为投资。可以肯定其投资额较高，实质回报率虽与其他方法相同，但涉及的金额一定会较低(因为投资的资金不会发挥杠杆效应)，而且只可以在金价上升之时才可以获利。一般的饰金买入及卖出价的差额较大，视作投资并不适宜，金条及金币由于不涉及其他成本，是实金投资的最佳选择。但需要注意的是持有黄金并不会产生利息收益。',1,NULL,NULL),('2ac82c2fdfd64e91ae6e9898465e8be5','123','0','','2018-06-12 23:09:51','','很抱歉，我还不知道答案 群里知道此问题答案的请 @机器猫 @提问者 建议答案：xxxxx',0,'0',''),('325023fa285747e3801411e1060cf67e','123456','0','','2018-06-13 22:14:10','ba4932f9c1304039b3fdf82f832e944c','789101112 来源：MyCat官方',1,'0','beb8d29ac3884f7db21740dd73eaf7ae'),('32806c343f4e413486c873c54501eb47','123','0','','2018-06-12 23:12:51','','很抱歉，我还不知道答案 群里知道此问题答案的请 @机器猫 @提问者 建议答案：xxxxx',0,'0',''),('339b2d9bde5d40238625cb40fac6078c','从mysql开始','834865081','','2018-06-09 22:55:26','','很抱歉，我还不知道答案 群里知道此问题答案的请 @机器猫 @提问者 建议答案：xxxxx',0,'0',''),('35a4de100b6041eb800ba08d594cd67c','你','admin','','2018-06-13 22:19:34','','我叫你爸爸',1,NULL,NULL),('38f48f52329c4b38a1eae20baa6f20f7','你好','admin','','2018-06-13 22:23:21','','我叫你爸爸啊',1,NULL,NULL),('45952dbf50804221b200ce9f0d072aec','你好','admin','','2018-07-20 22:19:56','','你好 有话就说 有屁就放',1,NULL,NULL),('4b5cbbb10c2848b6a52fa5cbac4dc420','nihao','snow','','2018-07-20 22:49:19','','请重新描述您的问题',0,NULL,NULL),('57a543a15b794385803b94e1b0d52624','123456','0','','2018-06-13 22:17:22','ba4932f9c1304039b3fdf82f832e944c','789101112 by：J2men',1,'0','beb8d29ac3884f7db21740dd73eaf7ae'),('5e741d22b2d947b09de5598ee3508811','2222222222222','snow','','2018-07-20 22:49:35','','请重新描述您的问题',0,NULL,NULL),('60d749784c284b43ad2863806aa947e2','你好','admin','','2018-06-13 22:28:02','','你好 有话就说 有屁就放',1,NULL,NULL),('658e40be24834f9b853e462680d75e16','123456','0','','2018-06-13 22:17:23','ba4932f9c1304039b3fdf82f832e944c','789101112 by：J2men',1,'0','beb8d29ac3884f7db21740dd73eaf7ae'),('702fed559271425c8fd1e392deab0558','你好','admin','','2018-06-13 22:23:53','','你好 有话就说 有屁就放',1,NULL,NULL),('7a20377b86914c50ba73f3c2b3a9caca','你好','0','','2018-06-13 22:24:40','b2a60df97b8c4e3491f9688b70b4c4db','你好 有话就说 有屁就放 by：J2men',1,'0','ca81c7e8473546ceb4170d6190736c97'),('82ebf2ceb9334e7db781f1c6fb3f868b','Mycat如何配置一个分表在一个数据库里？','834865081','','2018-06-09 22:54:47','','很抱歉，我还不知道答案 群里知道此问题答案的请 @机器猫 @提问者 建议答案：xxxxx',0,'0',''),('84160d5616c34fcaa40b7e580a39f1b6','国债我的天吗','admin','','2018-07-20 22:20:44','','你好！国债期货每份价值100万，五年期的国债期货保证金是1.2%%，十年期的保证金是2%。五年期的一手一万多，十年期的一手两万多，对应的国债指数。',1,NULL,NULL),('90c9dc1434944405b28b405bf60e3f46','你是猪吗','snow','','2018-07-20 22:49:26','','你好 有话就说 有屁就放',1,NULL,NULL),('92c1391b750d4c40b027f800dd26db42','Mycat','834865081','','2018-06-09 22:54:28','','很抱歉，我还不知道答案 群里知道此问题答案的请 @机器猫 @提问者 建议答案：xxxxx',0,'0',''),('978d7441d58f42cbac05dca906e8dbdb','国债期货','admin','','2018-06-13 22:47:26','','你好！国债期货每份价值100万，五年期的国债期货保证金是1.2%%，十年期的保证金是2%。五年期的一手一万多，十年期的一手两万多，对应的国债指数。',1,NULL,NULL),('9f60815fa6064ede8e9a72db83a14abe','123456','0','','2018-06-13 22:17:22','ba4932f9c1304039b3fdf82f832e944c','789101112 by：J2men',1,'0','beb8d29ac3884f7db21740dd73eaf7ae'),('a1df73cc02444eb38e3b116037a5946e','国债期货一手怎么算？','admin','','2018-06-13 22:46:45','','你好！国债期货每份价值100万，五年期的国债期货保证金是1.2%%，十年期的保证金是2%。五年期的一手一万多，十年期的一手两万多，对应的国债指数。',1,NULL,NULL),('a3465ccf896b4c8eb0507246643e91de','黄金','admin','','2018-07-20 22:16:45','','黄金的实物交易一般是去银行或者金店买实物黄金，比如金条，金币，首饰等，实物黄金一般都是去银行购买金条，然后坐等升值，只有升值才能盈利，具体去银行购买就可以了，然后可以存在银行，这样很方便，但是每年大概需要交300元的报关费，银行回收是不收取任何手续费的这个比较简单。实物黄金买卖包括金条、金币和金饰等交易，以持有黄金作为投资。可以肯定其投资额较高，实质回报率虽与其他方法相同，但涉及的金额一定会较低(因为投资的资金不会发挥杠杆效应)，而且只可以在金价上升之时才可以获利。一般的饰金买入及卖出价的差额较大，视作投资并不适宜，金条及金币由于不涉及其他成本，是实金投资的最佳选择。但需要注意的是持有黄金并不会产生利息收益。',1,NULL,NULL),('a5a4cbae434740dfac23a2813dab23fd','黄金投资','admin','','2018-07-20 22:16:57','','黄金的实物交易一般是去银行或者金店买实物黄金，比如金条，金币，首饰等，实物黄金一般都是去银行购买金条，然后坐等升值，只有升值才能盈利，具体去银行购买就可以了，然后可以存在银行，这样很方便，但是每年大概需要交300元的报关费，银行回收是不收取任何手续费的这个比较简单。实物黄金买卖包括金条、金币和金饰等交易，以持有黄金作为投资。可以肯定其投资额较高，实质回报率虽与其他方法相同，但涉及的金额一定会较低(因为投资的资金不会发挥杠杆效应)，而且只可以在金价上升之时才可以获利。一般的饰金买入及卖出价的差额较大，视作投资并不适宜，金条及金币由于不涉及其他成本，是实金投资的最佳选择。但需要注意的是持有黄金并不会产生利息收益。',1,NULL,NULL),('a8e06fc1d51647cd86ddd00bd62438e9','国债怎么投资','admin','','2018-07-20 22:20:11','','你好！国债期货每份价值100万，五年期的国债期货保证金是1.2%%，十年期的保证金是2%。五年期的一手一万多，十年期的一手两万多，对应的国债指数。',1,NULL,NULL),('a97dfe82b99a4449a3261e3bdcdd7dea','你好','admin','','2018-07-20 22:19:30','','你好 有话就说 有屁就放',1,NULL,NULL),('ab36f1a2834f4d5f80a3082b32607c65','你是谁','admin','','2018-07-20 22:18:21','','你好 有话就说 有屁就放',1,NULL,NULL),('ae466a1ac896424aae99d7543e7b26c0','你好','admin','','2018-06-13 22:28:33','','你好 有话就说 有屁就放',1,NULL,NULL),('c4b6d892dfd744288729acb9f38ee7f7','123','0','','2018-06-13 21:59:15','','很抱歉，我还不知道答案 群里知道此问题答案的请 @机器猫 @提问者 建议答案：xxxxx',0,'0',''),('c60fad4eea6542a68c623b4df5da4317','黄金交易','admin','','2018-06-13 22:50:01','','黄金的实物交易一般是去银行或者金店买实物黄金，比如金条，金币，首饰等，实物黄金一般都是去银行购买金条，然后坐等升值，只有升值才能盈利，具体去银行购买就可以了，然后可以存在银行，这样很方便，但是每年大概需要交300元的报关费，银行回收是不收取任何手续费的这个比较简单。实物黄金买卖包括金条、金币和金饰等交易，以持有黄金作为投资。可以肯定其投资额较高，实质回报率虽与其他方法相同，但涉及的金额一定会较低(因为投资的资金不会发挥杠杆效应)，而且只可以在金价上升之时才可以获利。一般的饰金买入及卖出价的差额较大，视作投资并不适宜，金条及金币由于不涉及其他成本，是实金投资的最佳选择。但需要注意的是持有黄金并不会产生利息收益。',1,NULL,NULL),('c69ffb30535141d28dd7e224cd7a31ee','你好\n我是谁','snow','','2018-07-20 22:22:29','','你好 有话就说 有屁就放',1,NULL,NULL),('c86a852e518f4c87917e6d0cc323ee88','123','admin','','2018-06-12 23:59:24','','请重新描述您的问题',0,NULL,NULL),('c9621fbcf70549c8916a3cad00909340','123456','admin','','2018-06-13 22:18:10','','789101112',1,NULL,NULL),('c9b1a115b8c6402d8d85ccb31b5b4735','你好','834865081','','2018-06-09 23:10:49','','很抱歉，我还不知道答案 群里知道此问题答案的请 @机器猫 @提问者 建议答案：xxxxx',0,'0',''),('cac46a39a936471db577784037f7c2a3','123456','0','','2018-06-13 22:14:06','ba4932f9c1304039b3fdf82f832e944c','789101112 来源：MyCat官方',1,'0','beb8d29ac3884f7db21740dd73eaf7ae'),('cd322dbd41184b8abc7336674fbce513','呵','admin','','2018-06-13 22:19:42','','呵你个鬼',1,NULL,NULL),('cf49dd553eb742838a4645f0a8915b60','你叫啥','admin','','2018-06-13 22:28:08','','我叫你爸爸啊',1,NULL,NULL),('d3622e87fd844032ac073f5f3b032e79','123','0','','2018-06-12 23:11:42','','很抱歉，我还不知道答案 群里知道此问题答案的请 @机器猫 @提问者 建议答案：xxxxx',0,'0',''),('d668835b8d6f4e9bbca63126fac6aeb5','123456','0','','2018-06-13 22:14:11','ba4932f9c1304039b3fdf82f832e944c','789101112 来源：MyCat官方',1,'0','beb8d29ac3884f7db21740dd73eaf7ae'),('d78395d38bda427abca45ad936227893','123','admin','','2018-06-12 23:59:57','','请重新描述您的问题',0,NULL,NULL),('dfd5649a1a39456c95b0193453f7cf33','黄金交易','admin','','2018-06-13 22:49:51','','黄金的实物交易一般是去银行或者金店买实物黄金，比如金条，金币，首饰等，实物黄金一般都是去银行购买金条，然后坐等升值，只有升值才能盈利，具体去银行购买就可以了，然后可以存在银行，这样很方便，但是每年大概需要交300元的报关费，银行回收是不收取任何手续费的这个比较简单。实物黄金买卖包括金条、金币和金饰等交易，以持有黄金作为投资。可以肯定其投资额较高，实质回报率虽与其他方法相同，但涉及的金额一定会较低(因为投资的资金不会发挥杠杆效应)，而且只可以在金价上升之时才可以获利。一般的饰金买入及卖出价的差额较大，视作投资并不适宜，金条及金币由于不涉及其他成本，是实金投资的最佳选择。但需要注意的是持有黄金并不会产生利息收益。',1,NULL,NULL),('dfd8cf762b1d47debf40c16a010eeced','国债期货','admin','','2018-07-20 22:17:11','','你好！国债期货每份价值100万，五年期的国债期货保证金是1.2%%，十年期的保证金是2%。五年期的一手一万多，十年期的一手两万多，对应的国债指数。',1,NULL,NULL),('e033182970c24701b6730a4916eac055','天下','admin','','2018-06-13 22:19:47','','请重新描述您的问题',0,NULL,NULL),('e1d8472748e24736a08903358243bb37','呵呵','admin','','2018-06-13 22:19:38','','呵你个鬼',1,NULL,NULL),('e7522aa898194941b4b4fba314d4c3b8','我去','snow','','2018-07-20 22:49:33','','请重新描述您的问题',0,NULL,NULL),('eeda627fbafc4f50bfce96eb6682fb95','nihao','admin','','2018-06-12 23:59:29','','请重新描述您的问题',0,NULL,NULL),('efc51c28114f47a180ab5b7b8086eb40','你叫啥','admin','','2018-06-13 22:28:38','','我叫你爸爸啊',1,NULL,NULL),('f3667c092a1d411b872e35152b715e94','你叫','admin','','2018-06-13 22:24:05','','我叫你爸爸啊',1,NULL,NULL),('f3d62cba8ff74a609ed0e584cbf4c265','123','0','','2018-06-13 22:14:00','','很抱歉，我还不知道答案 群里知道此问题答案的请 @机器猫 @提问者 建议答案：xxxxx',0,'0',''),('f5214fd5a4e34c22976ddccd86db769a','你好','admin','','2018-07-20 22:18:10','','你好 有话就说 有屁就放',1,NULL,NULL),('fa6b16c2049c47c9b6a05048748f78f3','无语','admin','','2018-06-13 22:24:09','','因为你是傻子',1,NULL,NULL),('fbc619ba56474330b0df7ec55b0fbd00','123456','0','','2018-06-13 22:14:14','ba4932f9c1304039b3fdf82f832e944c','789101112 来源：MyCat官方',1,'0','beb8d29ac3884f7db21740dd73eaf7ae'),('fdd3dbc6cff34c1c8d980c2de8cc5c92','你叫啥','admin','','2018-06-13 22:24:02','','我叫你爸爸啊',1,NULL,NULL),('fddba69fbaa9470c9bd2e9d4a8ce9fe4','无语','admin','','2018-06-13 22:28:14','','因为你是傻子',1,NULL,NULL);
/*!40000 ALTER TABLE `talk_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` varchar(32) NOT NULL,
  `username` varchar(32) DEFAULT NULL COMMENT '用户名',
  `password` varchar(64) DEFAULT NULL COMMENT '登录密码',
  `name` varchar(32) DEFAULT NULL COMMENT '昵称',
  `email` varchar(64) DEFAULT NULL COMMENT '邮箱',
  `mobile_phone` varchar(16) DEFAULT NULL COMMENT '手机号',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `remarks` varchar(255) DEFAULT NULL COMMENT '备注',
  `user_type` char(255) DEFAULT '0' COMMENT '用户类型',
  `portrait_url` varchar(255) DEFAULT '' COMMENT '图片url',
  `enabled` tinyint(1) DEFAULT '1' COMMENT '是否启用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('6ff034ba0a8c4695ae5ef7e1d407f0d7','snow','snow','snow','snow@j2men.com','','2018-07-20 22:21:23','','0','',1),('f985db77928b412e9f307547f0b1df56','admin','admin','admin1','admin1','','2017-05-05 14:47:24','','1','',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-07-26 14:40:13
