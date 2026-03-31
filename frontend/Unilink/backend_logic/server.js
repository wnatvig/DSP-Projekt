// backend_logic/server.js
const express = require('express');
const app = express();

app.use(express.json());

// login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'sam@example.com' && password === '123456') {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.post('/quit', (req, res) => {
    const { email, password } = req.body;
  
    if (email === 'sam@example.com' && password === '123456') {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });

app.listen(3000, () => {
  console.log('Server running on port 3000');
});