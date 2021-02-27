DROP DATABASE IF EXISTS cmsDB;

CREATE DATABASE cmsDB;

USE cmsDB;


CREATE TABLE Deparment(
  id INT NOT NULL AUTO_INCREMENT,
  department VARCHAR(50),
  PRIMARY KEY (id)
);

CREATE TABLE Role_Detail (
  id INT NOT NULL AUTO_INCREMENT,
  job_title VARCHAR(50),
  salary DECIMAL(10,2),
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id)
        REFERENCES Deparment(id) ON UPDATE CASCADE ON DELETE RESTRICT,
);

CREATE TABLE Employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(50) Not NULL,
  last_name VARCHAR(50) Not NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (manager_id)
        REFERENCES Employee(id) ON UPDATE CASCADE ON DELETE RESTRICT,
);
