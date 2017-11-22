-- MySQL Script generated by MySQL Workbench
-- mer. 25 oct. 2017 17:22:09 CEST
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema kapp
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `kapp` ;

-- -----------------------------------------------------
-- Schema kapp
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `kapp` DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
USE `kapp` ;

-- -----------------------------------------------------
-- Table `kapp`.`barman`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kapp`.`barman` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(320) NULL,
  `password` BINARY(64) NOT NULL,
  `surname` VARCHAR(20) NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `code` BINARY(64) NOT NULL,
  `firstName` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(45) NOT NULL,
  `dateOfBirth` DATE NULL,
  `facebook` VARCHAR(255) NULL,
  `godFather` INT NULL,
  `cheminement` TEXT NULL,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  PRIMARY KEY (`id`),
  INDEX `fk_barman_barman_idx` (`godFather` ASC),
  CONSTRAINT `fk_barman_barman`
    FOREIGN KEY (`godFather`)
    REFERENCES `kapp`.`barman` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `kapp`.`kommission`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kapp`.`kommission` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `kapp`.`member`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kapp`.`member` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `firstName` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(45) NOT NULL,
  `school` VARCHAR(40) NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `kapp`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kapp`.`role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `kapp`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kapp`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `kapp`.`service`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kapp`.`service` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `startingDate` TIMESTAMP NOT NULL,
  `finishDate` TIMESTAMP NULL,
  `nbMax` INT NULL,
  `categoryId` INT NOT NULL,
  PRIMARY KEY (`id`, `categoryId`),
  INDEX `fk_service_category1_idx` (`categoryId` ASC),
  CONSTRAINT `fk_service_category1`
    FOREIGN KEY (`categoryId`)
    REFERENCES `kapp`.`category` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT);


-- -----------------------------------------------------
-- Table `kapp`.`barman_has_kommission`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kapp`.`barman_has_kommission` (
  `barmanId` INT NOT NULL,
  `kommissionId` INT NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `finishAt` TIMESTAMP NULL,
  PRIMARY KEY (`barmanId`, `kommissionId`),
  INDEX `fk_barman_has_commission_commission1_idx` (`kommissionId` ASC),
  INDEX `fk_barman_has_commission_barman_idx` (`barmanId` ASC),
  CONSTRAINT `fk_barman_has_commission_barman`
    FOREIGN KEY (`barmanId`)
    REFERENCES `kapp`.`barman` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_barman_has_commission_commission`
    FOREIGN KEY (`kommissionId`)
    REFERENCES `kapp`.`kommission` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `kapp`.`barman_has_service`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kapp`.`barman_has_service` (
  `barmanId` INT NOT NULL,
  `serviceId` INT NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`barmanId`, `serviceId`),
  INDEX `fk_barman_has_service_service1_idx` (`serviceId` ASC),
  INDEX `fk_barman_has_service_barman1_idx` (`barmanId` ASC),
  CONSTRAINT `fk_barman_has_service_barman`
    FOREIGN KEY (`barmanId`)
    REFERENCES `kapp`.`barman` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_barman_has_service_service`
    FOREIGN KEY (`serviceId`)
    REFERENCES `kapp`.`service` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `kapp`.`barman_has_role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kapp`.`barman_has_role` (
  `barmanId` INT NOT NULL,
  `roleId` INT NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `finishAt` TIMESTAMP NULL,
  PRIMARY KEY (`barmanId`, `roleId`),
  INDEX `fk_barman_has_role_role1_idx` (`roleId` ASC),
  INDEX `fk_barman_has_role_barman1_idx` (`barmanId` ASC),
  CONSTRAINT `fk_barman_has_role_barman`
    FOREIGN KEY (`barmanId`)
    REFERENCES `kapp`.`barman` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_barman_has_role_role`
    FOREIGN KEY (`roleId`)
    REFERENCES `kapp`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
