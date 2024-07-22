const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3003;

// Use CORS and body-parser middleware
app.use(cors());
app.use(bodyParser.json());

// Dummy user data
const users = [
  { email: 'user@example.com', password: 'password123' },
  // Add more users as needed
];

// Endpoint for handling login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email && user.password === password);

  if (user) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
