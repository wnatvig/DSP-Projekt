DROP DATABASE IF EXISTS unilink;
CREATE DATABASE unilink;
USE unilink;

CREATE TABLE users (
    user_id VARCHAR (255) NOT NULL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR (200) UNIQUE NOT NULL,
    gender VARCHAR(100) NOT NULL,
    bio TEXT
);

CREATE TABLE courses (
    course_id VARCHAR (50) NOT NULL PRIMARY KEY,
    course_name VARCHAR (255) NOT NULL
);

CREATE TABLE events (
    event_id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id VARCHAR(255),
    event_name VARCHAR(255) NOT NULL,
    event_description TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_image VARCHAR(255) NOT NULL,
    event_location TEXT NOT NULL,
    max_participants INT(11) NOT NULL,
    FOREIGN KEY user_id REFERENCES users(user_id)
);

CREATE TABLE event_participants (
    event_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE FUNCTION full_name(first_name VARCHAR(100), last_name VARCHAR(100))
RETURNS VARCHAR(200)
RETURN CONCAT(first_name, ' ', last_name);

-- TODO;
-- Vi behöver skapa funktioner för att göra följande:
--  1. Lägga in användare och event i databasen
--  2. När användare & event är tillagda ska de hamna i rätt tabeller + i event_participants
--  3. SELECT funktionen för att göra en "lookup" på en användare eller ett event
--  4. Ta bort användare från tabeller, se till att alla referenser (cascade borde lösa) försvinner samtidigt
--  5. Göra lookup baserat på andra specifikationer som ID, namn, kön, etc...
--  6. implementera chattar



