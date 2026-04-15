CREATE DATABASE unilink;

USE unilink;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR (200) UNIQUE,
    gender VARCHAR(100)
);

CREATE TABLE courses (
    course_id VARCHAR (50) PRIMARY KEY,
    course_name VARCHAR (255)
);


