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

-- ----------------------------
-- Table structure for faq
-- ----------------------------
DROP TABLE IF EXISTS `faq`;
CREATE TABLE `faq` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `summary` varchar(255) DEFAULT NULL COMMENT '标题',
  `url` varchar(255) DEFAULT NULL COMMENT '资源地址',
  `status` char(255) DEFAULT NULL COMMENT '状态（0：正常，1：失效）',
  `remarks` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

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
-- Table structure for table `talk_record`
--

DROP TABLE IF EXISTS `talk_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `talk_record` (
  `id` varchar(36) NOT NULL COMMENT '主键',
  `content` varchar(500) NOT NULL COMMENT '提问内容',
  `user_id` varchar(36) DEFAULT NULL COMMENT '用户ID',
  `user_type` char(255) NOT NULL DEFAULT '0' COMMENT '用户类型（0：客户，1：客服）',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `connection_id` varchar(36) NOT NULL COMMENT '连接ID',
  `reply` varchar(500) DEFAULT NULL COMMENT '回复内容',
  `replyType` tinyint(2) DEFAULT NULL COMMENT '1找到内容',
  `groupId` varchar(20) DEFAULT NULL COMMENT 'QQ群ID',
  `questionId` varchar(36) DEFAULT NULL COMMENT '问题ID',
  `from_user_id` varchar(32) DEFAULT NULL COMMENT '用户ID',
  `from_user_name` varchar(32) DEFAULT NULL COMMENT '用户名',
  `from_ip` varchar(128) DEFAULT NULL,
  `to_ip` varchar(128) DEFAULT NULL,
  `to_user_id` varchar(36) DEFAULT NULL,
  `to_user_name` varchar(36) DEFAULT NULL,
  `type` char(255) NOT NULL DEFAULT '0' COMMENT '用户类型（0：客户，1：客服， 2：客户图片，3：客服图片）',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `groupId` (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='沟通记录';
/*!40101 SET character_set_client = @saved_cs_client */;

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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-07-26 15:28:06
