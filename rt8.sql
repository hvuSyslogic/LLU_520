-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: mobssi
-- ------------------------------------------------------
-- Server version	5.7.17-log

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
-- Table structure for table `accesslevels`
--

DROP TABLE IF EXISTS `accesslevels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accesslevels` (
  `BadgeID` bigint(20) NOT NULL DEFAULT '0',
  `AccsLvlID` int(11) NOT NULL,
  `AccsLvlName` varchar(64) NOT NULL,
  `EmpID` varchar(40) DEFAULT NULL,
  `updateTime` varchar(25) NOT NULL,
  PRIMARY KEY (`BadgeID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accesslevels`
--

LOCK TABLES `accesslevels` WRITE;
/*!40000 ALTER TABLE `accesslevels` DISABLE KEYS */;
INSERT INTO `accesslevels` VALUES (0,1,'Main','','1502158262272'),(47442,1,'Main','90800','1502158262272'),(50695,1,'Main','90800','1502158262272'),(31772,1,'Main','129428','1502158262272'),(35942,1,'Main','129428','1502158262272'),(46531,1,'Main','129428','1502158262272'),(48700,1,'Main','140968','1502158262272'),(564,1,'Main','140968','1502158262272'),(46399,1,'Main','140968','1502158262272'),(41923,1,'Main','','1502158262272'),(53247,1,'Main','','1502158262272'),(52987,1,'Main','','1502158262272'),(32738,1,'Main','','1502158262272'),(37075,1,'Main','','1502158262272'),(41695,1,'Main','','1502158262272'),(47358,1,'Main','','1502158262272'),(53809,1,'Main','','1502158262272'),(56544,1,'Main','5763','1502158262272'),(32852,1,'Main','120656','1502158262272'),(45156,1,'Main','132416','1502158262272'),(47599,1,'Main','38531','1502158262272'),(55636,1,'Main','1033','1502158262272'),(58628,1,'Main','138961','1502158262272'),(35107,1,'Main','18966','1502158262272'),(36088,1,'Main','13257','1502158262272'),(37766,1,'Main','164073','1502158262272'),(35757,1,'Main','7203','1502158262272'),(52709,1,'Main','100579','1502158262272'),(59931,1,'Main','156712','1502158262272'),(51425,1,'Main','104360','1502158262272'),(51409,1,'Main','111555','1502158262272'),(31254,1,'Main','129692','1502158262272'),(31751,1,'Main','77053','1502158262272'),(38183,1,'Main','130611','1502158262272'),(37677,1,'Main','158474','1502158262272'),(41091,1,'Main','54138','1502158262272'),(41231,1,'Main','89586','1502158262272'),(47187,1,'Main','127172','1502158262272'),(48544,1,'Main','161321','1502158262272'),(45760,1,'Main','161939','1502158262272'),(44856,1,'Main','30623','1502158262272'),(44661,1,'Main','97119','1502158262272'),(49466,1,'Main','153429','1502158262272'),(38531,1,'Main','81091','1502158262272'),(48811,1,'Main','75101','1502158262272'),(45946,1,'Main','91327','1502158262272'),(37516,1,'Main','10148','1502158262272'),(44363,1,'Main','129044','1502158262272'),(35770,1,'Main','19756','1502158262272'),(46405,1,'Main','150223','1502158262272'),(35771,1,'Main','105943','1502158262272'),(39609,1,'Main','73159','1502158262272'),(44699,1,'Main','135489','1502158262272'),(59303,1,'Main','88158','1502158262272'),(34703,1,'Main','163352','1502158262272'),(35686,1,'Main','128385','1502158262272'),(39611,1,'Main','121144','1502158262272'),(32348,1,'Main','101601','1502158262272'),(57891,1,'Main','23418','1502158262272'),(36015,1,'Main','83998','1502158262272'),(37514,1,'Main','78541','1502158262272'),(48982,1,'Main','26020','1502158262272'),(54462,1,'Main','134392','1502158262272'),(32122,1,'Main','164334','1502158262272'),(44366,1,'Main','158997','1502158262272');
/*!40000 ALTER TABLE `accesslevels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attendance` (
  `MobSSID` int(11) DEFAULT NULL,
  `FirstName` varchar(25) DEFAULT NULL,
  `LastName` varchar(25) DEFAULT NULL,
  `InTIme` varchar(20) DEFAULT NULL,
  `OutTIme` varchar(20) DEFAULT NULL,
  `EventID` varchar(25) DEFAULT NULL,
  `EventName` varchar(40) DEFAULT NULL,
  `iClassNumber` bigint(20) DEFAULT NULL,
  `AttendDate` varchar(20) DEFAULT NULL,
  `InSeconds` varchar(20) DEFAULT NULL,
  `OutSeconds` varchar(20) DEFAULT NULL,
  `EmpID` varchar(40) DEFAULT NULL,
  `RecordStatus` varchar(10) DEFAULT NULL,
  `MobSSOperator` varchar(10) DEFAULT NULL,
  KEY `firstName` (`FirstName`),
  KEY `lastName` (`LastName`),
  KEY `id` (`iClassNumber`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (8040,'Heather','Acheson','','1:54 pm','38','jet hail test A',547,'6/9/17','','1497041692','38372','Local',''),(8040,'Austin','Barnes','1:30 pm','2:15 pm','83','Jet maintenance review',502,'6/9/17','','1497042904','38372','Local',''),(8040,'Heather','Acheson','2:27 pm','2:27 pm','83','Jet maintenance review',547,'6/9/17','1497043654','1497043648','38372','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(4,'george','monbiot','','','','',4,'','','','44','Local',''),(5,'lenny','henry','','','','',5,'','','','55','Local',''),(6,'frank','sinatra','','','','',6,'','','','66','Local',''),(NULL,'Robert','Fitch','03:00','03:30','75','East Plant HAZOP',47442,'2017-06-01',NULL,NULL,'90800',NULL,NULL),(NULL,'Beverly','Wilson','03:00','03:30','75','East Plant HAZOP',31772,'2017-06-01',NULL,NULL,'129428',NULL,NULL),(NULL,'William','Thompson','03:05','03:35','75','East Plant HAZOP',48700,'2017-06-01',NULL,NULL,'140968',NULL,NULL),(NULL,'Michael','Walden','03:05','03:35','75','East Plant HAZOP',37075,'2017-06-01',NULL,NULL,'',NULL,NULL),(5274,'William','Thompson','8:06 am','','85','ACM test on device',564,'8/7/17','1502118414','','140968','Local','');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `connections`
--

DROP TABLE IF EXISTS `connections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `connections` (
  `AuthCode` varchar(40) DEFAULT NULL,
  `ConnectionAttemptTime` varchar(40) DEFAULT NULL,
  `Result` varchar(5) DEFAULT NULL,
  `Lat` float(10,6) DEFAULT NULL,
  `Lng` float(10,6) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `connections`
--

LOCK TABLES `connections` WRITE;
/*!40000 ALTER TABLE `connections` DISABLE KEYS */;
/*!40000 ALTER TABLE `connections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deviceheader`
--

DROP TABLE IF EXISTS `deviceheader`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deviceheader` (
  `AuthCode` varchar(40) DEFAULT NULL,
  `DateIssued` varchar(40) DEFAULT NULL,
  `ConnectionAttemptCount` int(8) DEFAULT NULL,
  `LastConnect` varchar(40) DEFAULT NULL,
  `CurrentStatus` varchar(5) DEFAULT NULL,
  `DeviceType` varchar(5) DEFAULT NULL,
  `MobssOperator` varchar(20) DEFAULT NULL,
  UNIQUE KEY `AuthCode` (`AuthCode`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deviceheader`
--

LOCK TABLES `deviceheader` WRITE;
/*!40000 ALTER TABLE `deviceheader` DISABLE KEYS */;
/*!40000 ALTER TABLE `deviceheader` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devicehistory`
--

DROP TABLE IF EXISTS `devicehistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `devicehistory` (
  `AuthCode` varchar(40) DEFAULT NULL,
  `Status` varchar(5) DEFAULT NULL,
  `StatusDate` varchar(40) DEFAULT NULL,
  `StatusChangeComment` varchar(100) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devicehistory`
--

LOCK TABLES `devicehistory` WRITE;
/*!40000 ALTER TABLE `devicehistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `devicehistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empbadge`
--

DROP TABLE IF EXISTS `empbadge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `empbadge` (
  `EmpID` varchar(40) DEFAULT NULL,
  `iClassNumber` bigint(20) DEFAULT NULL,
  `StatusID` int(11) NOT NULL,
  `StatusName` varchar(32) NOT NULL,
  `updateTime` varchar(25) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empbadge`
--

LOCK TABLES `empbadge` WRITE;
/*!40000 ALTER TABLE `empbadge` DISABLE KEYS */;
INSERT INTO `empbadge` VALUES ('',0,1,'Active','1502158262272'),('90800',47442,1,'Active','1502158262272'),('90800',50695,1,'Active','1502158262272'),('129428',31772,1,'Active','1502158262272'),('129428',35942,1,'Active','1502158262272'),('129428',46531,1,'Active','1502158262272'),('140968',48700,1,'Active','1502158262272'),('140968',564,1,'Active','1502158262272'),('140968',46399,1,'Active','1502158262272'),('',0,1,'Active','1502158262272'),('',41923,1,'Active','1502158262272'),('',53247,1,'Active','1502158262272'),('',0,1,'Active','1502158262272'),('',52987,1,'Active','1502158262272'),('',32738,1,'Active','1502158262272'),('',37075,1,'Active','1502158262272'),('',41695,1,'Active','1502158262272'),('',47358,1,'Active','1502158262272'),('',53809,1,'Active','1502158262272'),('5763',56544,1,'Active','1502158262272'),('120656',32852,1,'Active','1502158262272'),('163520',0,1,'Active','1502158262272'),('132416',45156,1,'Active','1502158262272'),('38531',47599,1,'Active','1502158262272'),('1033',55636,1,'Active','1502158262272'),('138961',58628,1,'Active','1502158262272'),('18966',35107,1,'Active','1502158262272'),('13257',36088,1,'Active','1502158262272'),('164073',37766,1,'Active','1502158262272'),('7203',35757,1,'Active','1502158262272'),('100579',52709,1,'Active','1502158262272'),('156712',59931,1,'Active','1502158262272'),('94336',0,1,'Active','1502158262272'),('104360',51425,1,'Active','1502158262272'),('111555',51409,1,'Active','1502158262272'),('129692',31254,1,'Active','1502158262272'),('77053',31751,1,'Active','1502158262272'),('130611',38183,1,'Active','1502158262272'),('158474',37677,1,'Active','1502158262272'),('54138',41091,1,'Active','1502158262272'),('89586',41231,1,'Active','1502158262272'),('127172',47187,1,'Active','1502158262272'),('161321',48544,1,'Active','1502158262272'),('161939',45760,1,'Active','1502158262272'),('30623',44856,1,'Active','1502158262272'),('97119',44661,1,'Active','1502158262272'),('153429',49466,1,'Active','1502158262272'),('81091',38531,1,'Active','1502158262272'),('75101',48811,1,'Active','1502158262272'),('91327',45946,1,'Active','1502158262272'),('10148',37516,1,'Active','1502158262272'),('129044',44363,1,'Active','1502158262272'),('19756',35770,1,'Active','1502158262272'),('150223',46405,1,'Active','1502158262272'),('105943',35771,1,'Active','1502158262272'),('73159',39609,1,'Active','1502158262272'),('135489',44699,1,'Active','1502158262272'),('88158',59303,1,'Active','1502158262272'),('163352',34703,1,'Active','1502158262272'),('128385',35686,1,'Active','1502158262272'),('121144',39611,1,'Active','1502158262272'),('101601',32348,1,'Active','1502158262272'),('23418',57891,1,'Active','1502158262272'),('83998',36015,1,'Active','1502158262272'),('78541',37514,1,'Active','1502158262272'),('26020',48982,1,'Active','1502158262272'),('134392',54462,1,'Active','1502158262272'),('164334',32122,1,'Active','1502158262272'),('158997',44366,1,'Active','1502158262272');
/*!40000 ALTER TABLE `empbadge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evacuation`
--

DROP TABLE IF EXISTS `evacuation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `evacuation` (
  `FirstName` varchar(64) DEFAULT NULL,
  `LastName` varchar(64) DEFAULT NULL,
  `iClassNumber` bigint(20) NOT NULL,
  `updateTime` varchar(64) DEFAULT NULL,
  `empID` varchar(40) DEFAULT NULL,
  `Status` varchar(10) DEFAULT NULL,
  `UserName` varchar(25) DEFAULT NULL,
  `image` blob NOT NULL,
  `title` varchar(32) NOT NULL,
  `imageName` varchar(25) NOT NULL,
  `hasImage` varchar(5) NOT NULL,
  PRIMARY KEY (`iClassNumber`),
  KEY `firstName` (`FirstName`),
  KEY `lastName` (`LastName`),
  KEY `id` (`iClassNumber`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evacuation`
--

LOCK TABLES `evacuation` WRITE;
/*!40000 ALTER TABLE `evacuation` DISABLE KEYS */;
/*!40000 ALTER TABLE `evacuation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `EventID` int(11) NOT NULL AUTO_INCREMENT,
  `EventName` varchar(40) NOT NULL,
  `EventDateTime` varchar(25) NOT NULL,
  `EventLocationName` varchar(40) NOT NULL,
  `EventSponsorName` varchar(40) NOT NULL,
  `DurationInMins` varchar(5) NOT NULL,
  `Latitude` varchar(10) NOT NULL,
  `Longitude` varchar(10) NOT NULL,
  `RecordStatus` varchar(10) NOT NULL,
  `Comments` varchar(256) NOT NULL,
  `updateTime` varchar(60) DEFAULT NULL,
  `EventsType` varchar(20) NOT NULL,
  `InvitationListID` int(11) NOT NULL,
  PRIMARY KEY (`EventID`),
  UNIQUE KEY `EventID_UNIQUE` (`EventID`)
) ENGINE=MyISAM AUTO_INCREMENT=86 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invitees`
--

DROP TABLE IF EXISTS `invitees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invitees` (
  `InvitationListID` int(11) NOT NULL,
  `BadgeNumber` bigint(20) DEFAULT NULL,
  `LastName` varchar(60) DEFAULT NULL,
  `FirstName` varchar(30) DEFAULT NULL,
  `EmailAddress` varchar(30) DEFAULT NULL,
  `NotificationNumber` bigint(20) unsigned NOT NULL,
  `NumberFormat` varchar(40) DEFAULT NULL,
  `UpdateTime` varchar(64) DEFAULT NULL,
  KEY `InvitationListID` (`InvitationListID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invitees`
--

LOCK TABLES `invitees` WRITE;
/*!40000 ALTER TABLE `invitees` DISABLE KEYS */;
/*!40000 ALTER TABLE `invitees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invitelist`
--

DROP TABLE IF EXISTS `invitelist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invitelist` (
  `InvitationListID` int(11) NOT NULL AUTO_INCREMENT,
  `ListName` varchar(100) DEFAULT NULL,
  `ListComment` varchar(100) DEFAULT NULL,
  `UpdateTime` varchar(64) DEFAULT NULL,
  KEY `InvitationListID` (`InvitationListID`)
) ENGINE=MyISAM AUTO_INCREMENT=157 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invitelist`
--

LOCK TABLES `invitelist` WRITE;
/*!40000 ALTER TABLE `invitelist` DISABLE KEYS */;
/*!40000 ALTER TABLE `invitelist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `muster`
--

DROP TABLE IF EXISTS `muster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `muster` (
  `BadgeID` bigint(20) NOT NULL,
  `DeviceID` varchar(40) DEFAULT NULL,
  `ScanTime` datetime DEFAULT NULL,
  `Zone` varchar(55) DEFAULT NULL,
  `LatLong` varchar(45) DEFAULT NULL,
  `ScanState` varchar(20) DEFAULT NULL,
  `musterID` varchar(25) DEFAULT NULL,
  `mobssOperator` varchar(45) DEFAULT NULL,
  `musterName` varchar(100) DEFAULT NULL,
  `musterPoint` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`BadgeID`),
  UNIQUE KEY `BadgeID_UNIQUE` (`BadgeID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `muster`
--

LOCK TABLES `muster` WRITE;
/*!40000 ALTER TABLE `muster` DISABLE KEYS */;
/*!40000 ALTER TABLE `muster` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mustermaster`
--

DROP TABLE IF EXISTS `mustermaster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mustermaster` (
  `musterID` int(11) NOT NULL AUTO_INCREMENT,
  `musterName` varchar(100) DEFAULT NULL,
  `Location` varchar(45) DEFAULT NULL,
  `dateTime` varchar(65) DEFAULT NULL,
  `musterCaptain` varchar(45) DEFAULT NULL,
  `Status` varchar(10) DEFAULT NULL,
  `Type` varchar(20) DEFAULT NULL,
  `Zones` varchar(20) DEFAULT NULL,
  `durationMinutes` varchar(10) DEFAULT NULL,
  KEY `musterID` (`musterID`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mustermaster`
--

LOCK TABLES `mustermaster` WRITE;
/*!40000 ALTER TABLE `mustermaster` DISABLE KEYS */;
/*!40000 ALTER TABLE `mustermaster` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `people`
--

DROP TABLE IF EXISTS `people`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `people` (
  `FirstName` varchar(64) DEFAULT NULL,
  `LastName` varchar(64) DEFAULT NULL,
  `iClassNumber` bigint(20) DEFAULT NULL,
  `updateTime` varchar(64) DEFAULT NULL,
  `EmpID` varchar(40) DEFAULT NULL,
  `Status` varchar(10) DEFAULT NULL,
  `UserName` varchar(25) DEFAULT NULL,
  `Image` blob,
  `Title` varchar(32) DEFAULT NULL,
  `imageName` varchar(100) DEFAULT NULL,
  `hasImage` varchar(5) DEFAULT NULL,
  `EmailAddr` varchar(40) DEFAULT NULL,
  `Department` varchar(40) DEFAULT NULL,
  `Division` varchar(40) DEFAULT NULL,
  `SiteLocation` varchar(40) DEFAULT NULL,
  `Building` varchar(40) DEFAULT NULL,
  `Identifier1` varchar(40) DEFAULT NULL,
  UNIQUE KEY `iClassNumber` (`iClassNumber`),
  UNIQUE KEY `iClassNumber_2` (`iClassNumber`,`EmpID`,`Title`),
  KEY `firstName` (`FirstName`),
  KEY `lastName` (`LastName`),
  KEY `id` (`iClassNumber`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `people`
--

LOCK TABLES `people` WRITE;
/*!40000 ALTER TABLE `people` DISABLE KEYS */;
INSERT INTO `people` VALUES ('ACC to ACM','Integration',0,'1502158262272','',NULL,NULL,NULL,'','1223e586-af4b-1036-9a24-3f8798df9431',NULL,'','','','','',''),('Robert','Fitch',47442,'1502158262272','90800',NULL,NULL,NULL,'','e88ffd12-b7cf-1036-9ac9-3f8798df9431',NULL,'Robert_Fitch@bcbst.com','Security and Safety','BBT','CHAT040100','CHAT040100','90800'),('Robert','Fitch',50695,'1502158262272','90800',NULL,NULL,NULL,'','e88ffd12-b7cf-1036-9ac9-3f8798df9431',NULL,'Robert_Fitch@bcbst.com','Security and Safety','BBT','CHAT040100','CHAT040100','90800'),('Beverly','Wilson',31772,'1502158262272','129428',NULL,NULL,NULL,'12','dcf74598-b89a-1036-9de4-3f8798df9431',NULL,'Beverly_Wilson@BCBST.com','Security and Safety','BBT','CHAT020100','CHAT020100','129428'),('Beverly','Wilson',35942,'1502158262272','129428',NULL,NULL,NULL,'12','dcf74598-b89a-1036-9de4-3f8798df9431',NULL,'Beverly_Wilson@BCBST.com','Security and Safety','BBT','CHAT020100','CHAT020100','129428'),('Beverly','Wilson',46531,'1502158262272','129428',NULL,NULL,NULL,'12','dcf74598-b89a-1036-9de4-3f8798df9431',NULL,'Beverly_Wilson@BCBST.com','Security and Safety','BBT','CHAT020100','CHAT020100','129428'),('William','Thompson',48700,'1502158262272','140968',NULL,NULL,NULL,'11','200d4742-b8a0-1036-9de9-3f8798df9431',NULL,'William_Thompson@bcbst.com','Security and Safety','BBT','CHAT040100','CHAT040100','140968'),('William','Thompson',564,'1502158262272','140968',NULL,NULL,NULL,'11','200d4742-b8a0-1036-9de9-3f8798df9431',NULL,'William_Thompson@bcbst.com','Security and Safety','BBT','CHAT040100','CHAT040100','140968'),('William','Thompson',46399,'1502158262272','140968',NULL,NULL,NULL,'11','200d4742-b8a0-1036-9de9-3f8798df9431',NULL,'William_Thompson@bcbst.com','Security and Safety','BBT','CHAT040100','CHAT040100','140968'),('Test','Six',41923,'1502158262272','',NULL,NULL,NULL,'','0a2a1f88-c9f6-1036-9717-4b61c2131b2b',NULL,'','','BLUE CROSS BLUE SHIELD OF TENN','','',''),('Contractor','319',53247,'1502158262272','',NULL,NULL,NULL,'','5d6c4c16-d513-1036-8f9f-f574e0375d13',NULL,'','','','','',''),('GW 729','Contractor ',52987,'1502158262272','',NULL,NULL,NULL,'Temporary','f93d678c-d591-1036-8b69-f574e0375d13',NULL,'','Security and Safety','','','',''),('MM 203','Contractor ',32738,'1502158262272','',NULL,NULL,NULL,'','cd6f576c-d656-1036-9aa7-bf6ad2d59c16',NULL,'','Security and Safety','','','',''),('Michael','Walden',37075,'1502158262272','',NULL,NULL,NULL,'','536f10fc-d880-1036-85f6-fdcda59d7928',NULL,'','Sr Mgr Faciliti','BBT','Cameron Hill Ch','',''),('FLIK 4','Contractor',41695,'1502158262272','',NULL,NULL,NULL,'','38acdcb0-d982-1036-901c-fdcda59d7928',NULL,'','','','','',''),('Jarren','Worsham',47358,'1502158262272','',NULL,NULL,NULL,'','960ab0e4-d9a5-1036-83e0-fdcda59d7928',NULL,'','','','','',''),('CH 208','Contractor',53809,'1502158262272','',NULL,NULL,NULL,'','7e67df1c-db43-1036-908e-b575e24f776c',NULL,'','','','','',''),('CH 239','Contractor',56544,'1502158262272','5763',NULL,NULL,NULL,'','7a48762e-db45-1036-86d4-b575e24f776c',NULL,'','','','','','5763'),('207','Memphis',32852,'1502158262272','120656',NULL,NULL,NULL,'','41d071b0-db4b-1036-9fcf-b575e24f776c',NULL,'','','','','','120656'),('716','Contractor',45156,'1502158262272','132416',NULL,NULL,NULL,'','6dcf6f5a-db4b-1036-8226-b575e24f776c',NULL,'','','','','','132416'),('717','Contractor',47599,'1502158262272','38531',NULL,NULL,NULL,'','6e0de0be-db4b-1036-8229-b575e24f776c',NULL,'','','','','','38531'),('719','Contractor',55636,'1502158262272','1033',NULL,NULL,NULL,'','6e4aec2a-db4b-1036-822c-b575e24f776c',NULL,'','','','','','1033'),('720','Contractor',58628,'1502158262272','138961',NULL,NULL,NULL,'','6eb38136-db4b-1036-822f-b575e24f776c',NULL,'','','','','','138961'),('721','Contractor',35107,'1502158262272','18966',NULL,NULL,NULL,'','6eecdfda-db4b-1036-8232-b575e24f776c',NULL,'','','','','','18966'),('724','Contractor',36088,'1502158262272','13257',NULL,NULL,NULL,'','6f27c9ec-db4b-1036-8235-b575e24f776c',NULL,'','','','','','13257'),('723','Contractor',37766,'1502158262272','164073',NULL,NULL,NULL,'','6f5d7ec0-db4b-1036-8238-b575e24f776c',NULL,'','','','','','164073'),('725','Contractor',35757,'1502158262272','7203',NULL,NULL,NULL,'','6f850e72-db4b-1036-823b-b575e24f776c',NULL,'','','','','','7203'),('727','Contractor',52709,'1502158262272','100579',NULL,NULL,NULL,'','6fe773fa-db4b-1036-8240-b575e24f776c',NULL,'','','','','','100579'),('728','Contractor',59931,'1502158262272','156712',NULL,NULL,NULL,'','70118eb0-db4b-1036-8243-b575e24f776c',NULL,'','','','','','156712'),('730','Contractor',51425,'1502158262272','104360',NULL,NULL,NULL,'','709decde-db4b-1036-824c-b575e24f776c',NULL,'','','','','','104360'),('CH 131','Contractor',51409,'1502158262272','111555',NULL,NULL,NULL,'','70ddcc0a-db4b-1036-8250-b575e24f776c',NULL,'','','','','','111555'),('CH 132','Contractor',31254,'1502158262272','129692',NULL,NULL,NULL,'','714986ac-db4b-1036-8256-b575e24f776c',NULL,'','','','','','129692'),('209','Memphis',31751,'1502158262272','77053',NULL,NULL,NULL,'','715fd45c-db4b-1036-8258-b575e24f776c',NULL,'','','','','','77053'),('210','Memphis',38183,'1502158262272','130611',NULL,NULL,NULL,'','717441c6-db4b-1036-825a-b575e24f776c',NULL,'','','','','','130611'),('211','Memphis',37677,'1502158262272','158474',NULL,NULL,NULL,'','718582d8-db4b-1036-825c-b575e24f776c',NULL,'','','','','','158474'),('212','Memphis',41091,'1502158262272','54138',NULL,NULL,NULL,'','71a2c870-db4b-1036-825f-b575e24f776c',NULL,'','','','','','54138'),('213','Memphis',41231,'1502158262272','89586',NULL,NULL,NULL,'','71d301a2-db4b-1036-8262-b575e24f776c',NULL,'','','','','','89586'),('214','Memphis',47187,'1502158262272','127172',NULL,NULL,NULL,'','720a36e0-db4b-1036-8265-b575e24f776c',NULL,'','','','','','127172'),('215','Memphis',48544,'1502158262272','161321',NULL,NULL,NULL,'','72283c58-db4b-1036-8267-b575e24f776c',NULL,'','','','','','161321'),('216','Memphis',45760,'1502158262272','161939',NULL,NULL,NULL,'','724bf012-db4b-1036-8269-b575e24f776c',NULL,'','','','','','161939'),('217','Memphis',44856,'1502158262272','30623',NULL,NULL,NULL,'','72672652-db4b-1036-826b-b575e24f776c',NULL,'','','','','','30623'),('218','Memphis',44661,'1502158262272','97119',NULL,NULL,NULL,'','72845722-db4b-1036-826d-b575e24f776c',NULL,'','','','','','97119'),('Contractor','242',49466,'1502158262272','153429',NULL,NULL,NULL,'','782d10a6-db4b-1036-82a2-b575e24f776c',NULL,'','','','','','153429'),('Contractor','243',38531,'1502158262272','81091',NULL,NULL,NULL,'','783ed782-db4b-1036-82a4-b575e24f776c',NULL,'','','','','','81091'),('Contractor','244',48811,'1502158262272','75101',NULL,NULL,NULL,'','7856ee8a-db4b-1036-82a6-b575e24f776c',NULL,'','','','','','75101'),('Contractor','245',45946,'1502158262272','91327',NULL,NULL,NULL,'','787961b8-db4b-1036-82a8-b575e24f776c',NULL,'','','','','','91327'),('Contractor','246',37516,'1502158262272','10148',NULL,NULL,NULL,'','78c31380-db4b-1036-82aa-b575e24f776c',NULL,'','','','','','10148'),('Contractor','308',44363,'1502158262272','129044',NULL,NULL,NULL,'','8321c7b8-db4b-1036-82fc-b575e24f776c',NULL,'','','','','','129044'),('Contractor','309',35770,'1502158262272','19756',NULL,NULL,NULL,'','83452154-db4b-1036-82fe-b575e24f776c',NULL,'','','','','','19756'),('Contractor','310',46405,'1502158262272','150223',NULL,NULL,NULL,'','836f1900-db4b-1036-8300-b575e24f776c',NULL,'','','','','','150223'),('Contractor','311',35771,'1502158262272','105943',NULL,NULL,NULL,'','839a5a5c-db4b-1036-8302-b575e24f776c',NULL,'','','','','','105943'),('Contractor','312',39609,'1502158262272','73159',NULL,NULL,NULL,'','83b8f2d2-db4b-1036-8304-b575e24f776c',NULL,'','','','','','73159'),('Contractor','313',44699,'1502158262272','135489',NULL,NULL,NULL,'','83d59608-db4b-1036-8307-b575e24f776c',NULL,'','','','','','135489'),('Contractor','315',59303,'1502158262272','88158',NULL,NULL,NULL,'','83fe3770-db4b-1036-830a-b575e24f776c',NULL,'','','','','','88158'),('Contractor','316',34703,'1502158262272','163352',NULL,NULL,NULL,'','84245fcc-db4b-1036-830c-b575e24f776c',NULL,'','','','','','163352'),('Contractor','317',35686,'1502158262272','128385',NULL,NULL,NULL,'','843c82dc-db4b-1036-830e-b575e24f776c',NULL,'','','','','','128385'),('Contractor','320',39611,'1502158262272','121144',NULL,NULL,NULL,'','87695dc2-db4b-1036-8327-b575e24f776c',NULL,'','','','','','121144'),('Contractor','321',32348,'1502158262272','101601',NULL,NULL,NULL,'','8788551a-db4b-1036-8329-b575e24f776c',NULL,'','','','','','101601'),('Contractor','322',57891,'1502158262272','23418',NULL,NULL,NULL,'','87e711d6-db4b-1036-832c-b575e24f776c',NULL,'','','','','','23418'),('Contractor','323',36015,'1502158262272','83998',NULL,NULL,NULL,'','880fc428-db4b-1036-832f-b575e24f776c',NULL,'','','','','','83998'),('Contractor','324',37514,'1502158262272','78541',NULL,NULL,NULL,'','8847b626-db4b-1036-8331-b575e24f776c',NULL,'','','','','','78541'),('Contractor','325',48982,'1502158262272','26020',NULL,NULL,NULL,'','887003ec-db4b-1036-8333-b575e24f776c',NULL,'','','','','','26020'),('Contractor','326',54462,'1502158262272','134392',NULL,NULL,NULL,'','888abf0c-db4b-1036-8335-b575e24f776c',NULL,'','','','','','134392'),('Contractor','327',32122,'1502158262272','164334',NULL,NULL,NULL,'','88acb382-db4b-1036-8337-b575e24f776c',NULL,'','','','','','164334'),('Contractor','328',44366,'1502158262272','158997',NULL,NULL,NULL,'','88c39746-db4b-1036-8339-b575e24f776c',NULL,'','','','','','158997');
/*!40000 ALTER TABLE `people` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `UserName` varchar(64) NOT NULL,
  `Password` varchar(140) DEFAULT NULL,
  `LastName` varchar(64) DEFAULT NULL,
  `FirstName` varchar(64) DEFAULT NULL,
  `EmpID` varchar(40) DEFAULT NULL,
  `UserEmail` varchar(64) DEFAULT NULL,
  `Status` varchar(4) NOT NULL,
  `UpdateTime` varchar(64) DEFAULT NULL,
  `PrivLevel` varchar(10) DEFAULT NULL,
  `RGen` varchar(20) DEFAULT NULL,
  KEY `UserName` (`UserName`)
) ENGINE=MyISAM AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('mobss','70cc61c093eef504c3e5e5311a1928075669e2a59845adcdd19f3c5a0ad62c9fefee4e834fe651a9773ba534dc6e7bc352b99fc19190856bfd38d61235f273ad','moby','dave','111','pbligh@mobss.com','1','2017-08-06 17:52:01','2','7d70f31427b66199');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verifyrecords`
--

DROP TABLE IF EXISTS `verifyrecords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verifyrecords` (
  `ScanDateTime` varchar(30) NOT NULL,
  `ScanDate` varchar(20) NOT NULL,
  `ScanTime` varchar(15) NOT NULL,
  `ScanSeconds` varchar(15) NOT NULL,
  `ClientSWID` varchar(20) NOT NULL,
  `MobSSOperator` varchar(10) DEFAULT NULL,
  `AcsLvlID` int(11) NOT NULL,
  `BadgeID` bigint(20) NOT NULL,
  `Result` varchar(3) NOT NULL,
  `BadgeStatusID` varchar(3) NOT NULL,
  `EmpID` varchar(40) DEFAULT NULL,
  `RecordStatus` varchar(10) NOT NULL,
  PRIMARY KEY (`ScanSeconds`,`BadgeID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verifyrecords`
--

LOCK TABLES `verifyrecords` WRITE;
/*!40000 ALTER TABLE `verifyrecords` DISABLE KEYS */;
/*!40000 ALTER TABLE `verifyrecords` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-08-08  7:28:16
