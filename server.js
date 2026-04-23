const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// koppla till databas
const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'admin',
  password: 'evavonbahr123',
  database: 'unilink'
});

db.connect((err) => {
  if (err) {
    console.error('DB connection failed:', err);
    return;
  }
  console.log('Connected to database Unilink');
});


app.post('/login', (req, res) => {
  const { email } = req.body;
  res.json({ message: 'Login endpoint works!' });
});

app.post('/create_account', (req, res) => {
  const { user_id, username, gender, bio } = req.body;

  if (!user_id || !username || !gender || !bio) {
    return res.json({ success: false, message: 'Missing fields' });
  }

  const query = 'INSERT INTO users (user_id, username, gender, bio) VALUES (?, ?, ?, ?)';
  db.query(query, [user_id, username, gender, bio], (err, result) => {
    if (err) {
      console.error('DB error:', err);
      return res.json({ success: false, message: err.message });
    }
    console.log('User created:', result.insertId);
    return res.json({ success: true, user_id2: result.insertId });
  });
});

// startar server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
