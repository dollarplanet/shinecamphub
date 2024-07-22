const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 3003;

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for testing purposes
    methods: ["GET", "POST"]
  },
  path: '/socket.io'
});

app.use(cors());
app.use(bodyParser.json());

// Set up PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Shinecampushub',
  password: 'admin123',  // Use the password you set during installation
  port: 5432,
});

// WebSocket connection handler
let users = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('registerUser', (userId) => {
    users[userId] = socket.id;
    console.log('User registered:', userId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });

  socket.on('searchUser', () => {
    let randomUser = Object.values(users).find(id => id !== socket.id);
    if (randomUser) {
      socket.emit('connectedUser', randomUser);
      io.to(randomUser).emit('connectedUser', socket.id);
    } else {
      socket.emit('connectedUser', null);
    }
  });

  socket.on('nextUser', () => {
    let randomUser = Object.values(users).find(id => id !== socket.id);
    if (randomUser) {
      socket.emit('connectedUser', randomUser);
      io.to(randomUser).emit('connectedUser', socket.id);
    } else {
      socket.emit('connectedUser', null);
    }
  });

  socket.on('message', async (msg) => {
    const recipientSocketId = users[msg.to];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('message', { text: msg.text, from: socket.id });

      // Save message to the database
      await pool.query(
        'INSERT INTO messages (sender_id, recipient_id, text) VALUES ($1, $2, $3)',
        [msg.from, msg.to, msg.text]
      );

      // Emit message to all clients
      io.emit('message', { text: msg.text, from: msg.from });
    }
  });
});

// Endpoint for handling login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt: ${email}`);

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      console.log('Login successful');
      res.status(200).json({ message: 'Login successful'});
    } else {
      console.log('Invalid password');
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint for handling user registration
app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id', [email, username, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



