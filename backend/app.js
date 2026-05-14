const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
app.use('/users', userRoutes);
app.use('/events', eventRoutes);

// socket.io chatten
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // joina chatt
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`);
        
        socket.to(roomId).emit('receiveMessage',{
            messageId: Date.now().toString(),
            eventId: roomId,
            userId: 'no',
            username: 'no',
            textString: 'A user joined the chat',
            timeSent: Date.now()
        });
    });

    // skicka msg
    socket.on('sendMessage', ({ roomId, userId, username, textString, timeSent }) => {
    io.to(roomId).emit('receiveMessage', {
        messageId: Date.now().toString(),
        eventId: roomId,
        userId,
        username,
        textString,
        timeSent
    });
});
    socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`${socket.id} left room ${roomId}`);
});

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// server istället för app
server.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000');
});