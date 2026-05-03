DROP DATABASE IF EXISTS unilink;
CREATE DATABASE unilink;
USE unilink;

CREATE TABLE users (
    userId VARCHAR(255) NOT NULL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    gender VARCHAR(100) NOT NULL,
    bio TEXT
);

CREATE TABLE courses (
    course_id VARCHAR(50) NOT NULL PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL
);

CREATE TABLE events (
    eventId VARCHAR(255) NOT NULL PRIMARY KEY,
    userId VARCHAR(255),
    eventName VARCHAR(255) NOT NULL,
    eventDescription TEXT NOT NULL,
    eventDate DATE NOT NULL,
    eventImage VARCHAR(255) NOT NULL,
    eventLocation TEXT NOT NULL,
    maxParticipants INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE TABLE event_participants (
    eventId VARCHAR(255) NOT NULL,
    userId VARCHAR(255) NOT NULL,
    PRIMARY KEY (eventId, userId),
    FOREIGN KEY (eventId) REFERENCES events(eventId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);