CREATE DATABASE unilink;

USE unilink;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR (255) UNIQUE,
    gender VARCHAR(255)
);

CREATE TABLE courses (
    course_id VARCHAR (255) PRIMARY KEY,
    course_name VARCHAR (255),
);


