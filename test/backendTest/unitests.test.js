const mysql = require('mysql2');
const {
    createEvent,
    createUser,
    getUser,
    getEvent,
    removeEvent,
    removeUser,
    getEventParticipants,
    getUserEvents
} = require('../../backend/services/DBfunctions');

const db = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'frontend',
    password: 'evavonbahr123',
    database: 'unitest'
});

describe('Database functions', () => {

    afterEach(async () => {

        await db.promise().query('DELETE FROM event_participants');
        await db.promise().query('DELETE FROM events');
        await db.promise().query('DELETE FROM users');

    });

    afterAll(async () => {

        await db.promise().end();

    });

    test('createUser creates a user in database', async () => {

        await createUser({
            userId: '1',
            username: 'Jimmie',
            gender: 'Male',
            bio: 'test bio'
        });

        const [rows] = await db.promise().query(
            'SELECT * FROM users WHERE userId = ?',
            ['1']
        );

        expect(rows.length).toBe(1);

        expect(rows[0].username).toBe('Jimmie');

        expect(rows[0].gender).toBe('Male');

    });

    test('getUser returns correct user', async () => {

        await db.promise().query(`
            INSERT INTO users (userId, username, gender, bio)
            VALUES (?, ?, ?, ?)
        `, ['2', 'Eva', 'Female', 'hello']);

        const result = await getUser({
            userId: '2'
        });

        expect(result.username).toBe('Eva');

        expect(result.gender).toBe('Female');

    });

    test('removeUser deletes user', async () => {

        await db.promise().query(`
            INSERT INTO users (userId, username, gender, bio)
            VALUES (?, ?, ?, ?)
        `, ['3', 'TestUser', 'Male', 'bio']);

        await removeUser({
            userId: '3'
        });

        const [rows] = await db.promise().query(
            'SELECT * FROM users WHERE userId = ?',
            ['3']
        );

        expect(rows.length).toBe(0);

    });

    test('createEvent creates event and participant', async () => {

        await db.promise().query(`
            INSERT INTO users (userId, username, gender, bio)
            VALUES (?, ?, ?, ?)
        `, ['4', 'Host', 'Male', 'bio']);

        await createEvent(
            {
                eventId: '100',
                eventName: 'Party',
                eventDescription: 'Big party',
                eventDate: '2026-05-03',
                eventImage: 'image.jpg',
                eventLocation: 'Uppsala',
                maxParticipants: 10,
                currentParticipants: 1
            },
            {
                userId: '4'
            }
        );

        const [eventRows] = await db.promise().query(
            'SELECT * FROM events WHERE eventId = ?',
            ['100']
        );

        const [participantRows] = await db.promise().query(
            'SELECT * FROM event_participants WHERE eventId = ?',
            ['100']
        );

        expect(eventRows.length).toBe(1);

        expect(eventRows[0].eventName).toBe('Party');

        expect(participantRows.length).toBe(1);

        expect(participantRows[0].userId).toBe('4');

    });

    test('getEvent returns correct event', async () => {

        await db.promise().query(`
            INSERT INTO users (userId, username, gender, bio)
            VALUES (?, ?, ?, ?)
        `, ['5', 'Creator', 'Male', 'bio']);

        await db.promise().query(`
            INSERT INTO events
            (eventId, userId, eventName, eventDescription, eventDate, eventImage, eventLocation, maxParticipants)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            '200',
            '5',
            'Study Group',
            'Math session',
            '2026-05-03',
            'img.jpg',
            'Campus',
            5
        ]);

        const result = await getEvent({
            eventId: '200'
        });

        expect(result.eventName).toBe('Study Group');

        expect(result.eventLocation).toBe('Campus');

    });

});
