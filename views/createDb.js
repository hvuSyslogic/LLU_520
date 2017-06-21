CREATE TABLE `people` (
  `FirstName` varchar(64) DEFAULT NULL,
  `LastName` varchar(64) DEFAULT NULL,
  `iClassNumber` int(18) DEFAULT NULL,
  `updateTime` varchar(64) DEFAULT NULL,
  `EmpID` int(18) DEFAULT NULL,
  `Status` varchar(10) DEFAULT NULL,
  `UserName` varchar(25) DEFAULT NULL,
  `Image` blob,
  `Title` varchar(32) DEFAULT NULL,
  `imageName` varchar(25) NOT NULL,
  `hasImage` varchar(5) NOT NULL,
  UNIQUE KEY `iClassNumber` (`iClassNumber`),
  UNIQUE KEY `iClassNumber_2` (`iClassNumber`,`EmpID`,`Title`),
  KEY `firstName` (`FirstName`),
  KEY `lastName` (`LastName`),
  KEY `id` (`iClassNumber`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 |