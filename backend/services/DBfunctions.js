//imports
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

//skapa pool av connections för att möjliggöra flera connections samtidigt.
const db = mysql.createPool(
    {
            host: 'localhost',
            port: 3306,
            user: 'frontend',
            password: 'evavonbahr123',
            database: 'unilink',
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
            (eventId, userId, eventName, eventDescription, eventDate, eventImage, eventLocation, maxParticipants, currentParticipants) 
            VALUES (?,?,?,?,?,?,?,?,?)
        `;

        const result = await con.query(query1, [
            event.eventId,
            user.userId,
            event.eventName,
            event.eventDescription,
            event.eventDate,
            event.eventImage,
            event.eventLocation,
            event.maxParticipants,
            event.currentParticipants
        ]);

        const query2 = `
            INSERT INTO eventParticipants (eventId, userId) 
            VALUES (?,?)
        `;

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

function joinEvent(event, user){
    
}

function leaveEvent(event, user){

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

async function getUser(user) {
    const query = 'SELECT * FROM users WHERE userId = ?';
    const result = await db.promise().query(query, [user.userId]);
    return result[0][0];
}

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

module.exports = {
    createEvent,
    createUser,
    getUser,
    getEvent,
    removeEvent,
    removeUser,
    getEventParticipants
}




// TODO;
// Vi behöver skapa funktioner för att göra följande:
//  1. Lägga in användare och event i databasen
//  2. När användare & event är tillagda ska de hamna i rätt tabeller + i event_participants
//  3. SELECT funktionen för att göra en "lookup" på en användare eller ett event
//  4. Ta bort användare från tabeller, se till att alla referenser (cascade borde lösa) försvinner samtidigt
//  5. Göra lookup baserat på andra specifikationer som ID, namn, kön, etc...
//  6. separera services och routes