CREATE SCHEMA IF NOT EXISTS `lscustoms`;
USE `lscustoms`;


-- ----------------------------------------------------------------------------------------- --
CREATE TABLE IF NOT EXISTS `brand` (
  `brand_id` INT NOT NULL AUTO_INCREMENT,
  `brand_name` VARCHAR(255) NOT NULL UNIQUE,
  `brand_revenue` INT DEFAULT NULL,
  `brand_creation_date` DATE NOT NULL,
  `brand_creator` VARCHAR(255) NOT NULL,
  `brand_creation_place` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`brand_id`)
);

-- ----------------------------------------------------------------------------------------- --
CREATE TABLE IF NOT EXISTS `car` (
  `car_id` INT NOT NULL AUTO_INCREMENT,
  `car_name` VARCHAR(255) NOT NULL UNIQUE,
  `car_seat_num` INT NOT NULL,
  `car_creation_date` DATE NOT NULL,
  `car_base_power` INT NOT NULL,
  `car_base_weight` DECIMAL(15,2) NOT NULL,
  `car_base_price` DECIMAL(15,2) NOT NULL,
  `brand_id` INT NOT NULL,
  PRIMARY KEY (`car_id`),
  CONSTRAINT `fk_car_brand` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`brand_id`)
);

-- ----------------------------------------------------------------------------------------- --
CREATE TABLE IF NOT EXISTS `store` (
  `store_id` INT NOT NULL AUTO_INCREMENT,
  `store_name` VARCHAR(255) NOT NULL,
  `store_director` VARCHAR(255) NOT NULL,
  `store_city` VARCHAR(255) NOT NULL,
  `store_country` VARCHAR(255) NOT NULL,
  `store_address` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`store_id`)
);

-- ----------------------------------------------------------------------------------------- --
CREATE TABLE IF NOT EXISTS `conn_C_S` (
  `C_S_id` INT NOT NULL AUTO_INCREMENT,
  `car_id` INT NOT NULL,
  `store_id` INT NOT NULL,
  PRIMARY KEY (`C_S_id`),
  CONSTRAINT `fk_conn_C_S_car` FOREIGN KEY (`car_id`) REFERENCES `car` (`car_id`),
  CONSTRAINT `fk_conn_C_S_store` FOREIGN KEY (`store_id`) REFERENCES `store` (`store_id`)
);

-- ----------------------------------------------------------------------------------------- --
CREATE TABLE IF NOT EXISTS `feature` (
  `feature_id` INT NOT NULL AUTO_INCREMENT,
  `feature_name` VARCHAR(255) NOT NULL,
  `feature_price` DECIMAL(15,2) NOT NULL,
  `feature_color` VARCHAR(255) DEFAULT NULL,
  `feature_added_power` INT DEFAULT NULL,
  `feature_added_weight` DECIMAL(15,2) DEFAULT NULL,
  PRIMARY KEY (`feature_id`)
);

-- ----------------------------------------------------------------------------------------- --
CREATE TABLE IF NOT EXISTS `conn_CS_F` (
  `CS_F_id` INT NOT NULL AUTO_INCREMENT,
  `C_S_id` INT NOT NULL,
  `feat_id` INT NOT NULL,
  PRIMARY KEY (`CS_F_id`),
  CONSTRAINT `fk_conn_CS_F_conn_C_S` FOREIGN KEY (`C_S_id`) REFERENCES `conn_C_S` (`C_S_id`),
  CONSTRAINT `fk_conn_CS_F_feature` FOREIGN KEY (`feat_id`) REFERENCES `feature` (`feature_id`)
);
