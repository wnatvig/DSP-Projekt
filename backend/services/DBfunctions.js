//imports
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
let eventCounter = 0;

//skapa pool av connections för att möjliggöra flera connections samtidigt.
const db = mysql.createPool(
    {
            host: 'localhost',
            port: 3306,
            user: 'frontend',
            password: 'evavonbahr123',
            database:
            process.env.NODE_ENV === 'test'
                ? 'unitest'
                : 'unilink',
            waitForConnections: true,
            connectionLimit: 4,
            queueLimit:0
    }
);

async function createUser(user){
    const query = 'INSERT INTO users (userId, username, gender, bio) VALUES (?,?,?,?)';
        const result = await db.promise().query(query,[
            user.userId,
            user.username,
            user.gender,
            user.bio]
        );
        return result[0];
}

async function createEvent(event, user) {
    const con = await db.promise().getConnection();
    try{
        await con.beginTransaction(); //ACID
        
        const query1 = `
            INSERT INTO events 
            (userId, eventName, eventDescription, eventDate, eventImage, eventLocation, maxParticipants) 
            VALUES (?,?,?,?,?,?,?)
        `;

        const result = await con.query(query1, [
            user.userId,
            event.eventName,
            event.eventDescription,
            event.eventDate,
            event.eventImage,
            event.eventLocation,
            event.maxParticipants,
        ]);

        const query2 = `INSERT INTO eventParticipants (eventId, userId) VALUES (?,?)`;

        await con.query(query2, [
            event.eventId,
            user.userId
        ]);
        await con.commit();
        return result[0];
    }
    catch (err){
        await con.rollback(); //Rollback vid error
        throw(err); //Skicka vidare error för att kunna lösa i nästa nivå
    }
    finally{
        con.release();
    }
}        

async function eventCount(){
    return eventCounter;
}


async function joinEvent(event, user){
    const query = `INSERT INTO eventParticipants (eventId, userId) VALUES (?,?)`;
    const result = await db.promise().query(query, [event.eventId, user.userId]);
    return result[0];
}

async function leaveEvent(event, user){
    const query = 'DELETE FROM eventParticipants WHERE eventId = ? AND userId = ?';
    const result = await db.promise().query(query, [event.eventId, user.userId]); 
    return result[0];
}

async function removeUser(user){
    const con = await db.promise().getConnection();
    try {
        await con.beginTransaction();

        await con.query('DELETE FROM events WHERE userId = ?', [user.userId]);

        await con.query('DELETE FROM users WHERE userId = ?', [user.userId]);

        await con.commit();
        console.log('User removed:', user.userId);
    } catch (err) {
        await con.rollback();
        throw err;
    } finally {
        con.release();
    }
}

async function removeEvent(event) {
    const con = await db.promise().getConnection();
    try {
        await con.beginTransaction();

        await con.query('DELETE FROM events WHERE eventId = ?', [event.eventId]);

        await con.commit();
        console.log('Event removed:', event.eventId);
    } catch (err) {
        await con.rollback();
        throw err;
    } finally {
        con.release();
    }
}

// Kan utöka funktionalitet för get funktioner genom att ändra SQL queries
async function getUser(userId) {
    const query = 'SELECT * FROM users WHERE userId = ?';
    const result = await db.promise().query(query, [userId]);
    return result[0][0];
}

// Motsvarande ändringar kan göras med getEvent, sökningar baserat på olika filtreringar
async function getEvent(event) {
    const query = 'SELECT * FROM events WHERE eventId = ?';
    const result = await db.promise().query(query, [event.eventId]);
    return result[0][0];
}

async function getEventParticipants(event) {
    const participantsQuery = 'SELECT * FROM eventParticipants WHERE eventId = ?';
    const participantsResult = await db.promise().query(participantsQuery, [event.eventId]);
    const participants = participantsResult[0];
    return {participants};
}

async function getParticipantCount(event) {
    const query = 'SELECT COUNT(*) as count FROM eventParticipants WHERE eventId = ?';
    const result = await db.promise().query(query, [event.eventId]);
    return result[0][0].count;
}

async function getUserEvents(user) {
    const eventQuery = 'SELECT * FROM eventParticipants WHERE userId = ?';
    const eventResults = await db.promise().query(eventQuery, [user.userId]);

    const events = [];

    for (const event of eventResults[0]) {
        const event = await getEvent({ eventId: event.eventId });
    }
    
    return events;
}

//Hämta ett event page med events sorterade och filtrerade  
// Man skulle kunna köra två sätt, en sökning ifall man använder userId och en sökning ifall man inte har det
async function getEventPage(user, filters = {}, pageSize) {


}

async function getFilterEvent(user, filters = {}) {
    let filterQuery = `
        SELECT events.*
        FROM events
        JOIN users
            ON events.userId = users.userId
        WHERE users.username = ?
    `;

    const values = [user.username];

    if (filters.eventName) {
        filterQuery += ' AND events.eventName = ?';
        values.push(filters.eventName);
    }

    if (filters.eventDate) {
        filterQuery += ' AND events.eventDate = ?';
        values.push(filters.eventDate);
    }

    if (filters.eventLocation) {
        filterQuery += ' AND events.eventLocation = ?';
        values.push(filters.eventLocation);
    }

    if (filters.maxParticipants) {
        filterQuery += ' AND events.maxParticipants = ?';
        values.push(filters.maxParticipants);
    }

    const [filteredEvents] = await db.promise().query(filterQuery, values);

    return filteredEvents;
}

//söka efter ett event från dess namn
async function searchEvent(eventname){
    
}

module.exports = {
    createEvent,
    createUser,
    getUser,
    getEvent,
    removeEvent,
    removeUser,
    getEventParticipants,
    getUserEvents,
    searchEvent,
    getFilterEvent,
    getParticipantCount,
    eventCount,
    
}


// TODO;
// Vi behöver skapa funktioner för att göra följande:
//  1. Lägga in användare och event i databasen
//  2. När användare & event är tillagda ska de hamna i rätt tabeller + i event_participants
//  3. SELECT funktionen för att göra en "lookup" på en användare eller ett event
//  4. Ta bort användare från tabeller, se till att alla referenser (cascade borde lösa) försvinner samtidigt
//  5. Göra lookup baserat på andra specifikationer som ID, namn, kön, etc...
//  6. separera services och routes