DROP DATABASE IF EXISTS unilink;
DROP USER IF EXISTS 'frontend'@'localhost';
CREATE USER 'frontend'@'localhost' IDENTIFIED BY 'evavonbahr123';
CREATE DATABASE unilink;
GRANT ALL PRIVILEGES ON unilink.* TO 'frontend'@'localhost';
FLUSH PRIVILEGES;
USE unilink;


-- Har med allt som kommer från front end. 
CREATE TABLE users (
    userId VARCHAR(255) NOT NULL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    gender VARCHAR(100) NOT NULL,
    bio TEXT
);

CREATE TABLE courses (
    courseID VARCHAR(50) NOT NULL PRIMARY KEY,
    courseName VARCHAR(255) NOT NULL
);

-- Ändrat eventId till AUTO_INCREMENT
CREATE TABLE events (
    eventId INT PRIMARY KEY AUTO_INCREMENT,
    userId VARCHAR(255),
    eventName VARCHAR(255) NOT NULL,
    eventDescription TEXT NOT NULL,
    eventDate DATETIME NOT NULL,
    eventImage VARCHAR(255) NOT NULL,
    eventLocation TEXT NOT NULL,
    maxParticipants INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE TABLE eventParticipants (
    eventId INT NOT NULL,
    userId VARCHAR(255) NOT NULL,
    PRIMARY KEY (eventId, userId),
    FOREIGN KEY (eventId) REFERENCES events(eventId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE TABLE eventChats (
    messageId INT PRIMARY KEY AUTO_INCREMENT,
    eventId INT NOT NULL,
    userId VARCHAR(255) NOT NULL,
    textString TEXT NOT NULL,
    timeSent DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eventId) REFERENCES events(eventId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);