DROP DATABASE IF EXISTS unilink;
DROP USER IF EXISTS 'frontend'@'localhost';
CREATE USER 'frontend'@'localhost' IDENTIFIED BY 'evavonbahr123';
CREATE DATABASE unilink;
GRANT ALL PRIVILEGES ON unilink.* TO 'frontend'@'localhost';
FLUSH PRIVILEGES;
USE unilink;


-- Har med allt som kommer från front end. 
CREATE TABLE users (
    userId VARCHAR (255) NOT NULL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    gender VARCHAR(100) NOT NULL,
    bio TEXT
);

CREATE TABLE courses (
    courseId VARCHAR (50) NOT NULL PRIMARY KEY,
    courseName VARCHAR (255) NOT NULL
);

CREATE TABLE events (
    eventId INT PRIMARY KEY AUTO_INCREMENT,
    userId VARCHAR(255),
    eventName VARCHAR(255) UNIQUE NOT NULL,
    eventDescription TEXT NOT NULL,
    eventDate DATE NOT NULL,
    eventImage VARCHAR(255) NOT NULL,
    eventLocation TEXT NOT NULL,
    maxParticipants INT NOT NULL,
    currentParticipants INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE eventParticipants (
    eventId INT NOT NULL,
    userId VARCHAR(255) NOT NULL,
    PRIMARY KEY (eventId, userId),
    FOREIGN KEY (eventId) REFERENCES events(eventId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE FUNCTION fullName(firstName VARCHAR(100), lastName VARCHAR(100))
RETURNS VARCHAR(200)
RETURN CONCAT(firstName, ' ', lastName);

-- TODO;
-- Vi behöver skapa funktioner för att göra följande:
--  1. Lägga in användare och event i databasen
--  2. När användare & event är tillagda ska de hamna i rätt tabeller + i event_participants
--  3. SELECT funktionen för att göra en "lookup" på en användare eller ett event
--  4. Ta bort användare från tabeller, se till att alla referenser (cascade borde lösa) försvinner samtidigt
--  5. Göra lookup baserat på andra specifikationer som ID, namn, kön, etc...
-- lägga till lösenord