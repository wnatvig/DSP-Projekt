const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//databas koppling
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

//posts

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  res.json({ message: 'Login endpoint works!' });
});

app.post('/create_account', (req, res) => {
  const { email, password, first_name, last_name, gender } = req.body;

  if (!email || !first_name || !last_name || !gender) {
    return res.json({ success: false, message: 'Missing fields' });
  }

  const query = 'INSERT INTO users (first_name, last_name, email, gender) VALUES (?, ?, ?, ?)';
  db.query(query, [first_name, last_name, email, gender], (err, result) => {
    if (err) {
      console.error('DB error:', err);
      return res.json({ success: false, message: err.message });
    }
    console.log('User created:', result.insertId);
    return res.json({ success: true, user_id: result.insertId });
  });
});

//starta grejen
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
