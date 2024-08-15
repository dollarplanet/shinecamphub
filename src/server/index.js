// Import dependencies
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create an HTTP server and wrap it with Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Set up PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'Shinecampushub',
  password: process.env.DB_PASSWORD || 'admin123',
  port: process.env.DB_PORT || 5432,
});

// JWT secret key from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Access denied, token missing!' });
  } else {
    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token invalid!' });
      } else {
        req.user = decoded;
        next();
      }
    });
  }
};

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
});

// Route to handle healer registration
app.post('/register/healer', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username or email already exists in the healer table
    const usernameCheck = await pool.query('SELECT id_healer FROM healer WHERE username = $1', [username]);
    const emailCheck = await pool.query('SELECT id_healer FROM healer WHERE email = $1', [email]);

    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Ensure the email is not null
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert healer data into the database
    const result = await pool.query(
      `INSERT INTO healer (username, email, password) 
       VALUES ($1, $2, $3) RETURNING id_healer`,
      [username, email, hashedPassword]
    );

    const healerId = result.rows[0].id_healer;

    // Send success response
    res.status(200).json({ healerId });
  } catch (error) {
    console.error('Healer registration failed:', error);
    res.status(500).json({ error: 'Healer registration failed' });
  }
});

// Unified login route for both users and healers
app.post('/login', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Query to get user details from the users table
    let result = await pool.query('SELECT id_user, username, password FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      // If no user found, check the healer table
      result = await pool.query('SELECT id_healer, username, password FROM healer WHERE email = $1', [email]);

      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      // Validate healer's password
      const healer = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, healer.password);

      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid password' });
      }

      // Create token for healer
      const token = jwt.sign(
        {
          healerId: healer.id_healer,
          username: healer.username,
        },
        JWT_SECRET,
        { expiresIn: '4h' } // Set token expiration to 4 hours
      );

      // Send response with healer details and token
      return res.json({
        message: 'Login successful',
        token: token,
        healer: {
          id_healer: healer.id_healer,
          username: healer.username,
        },
      });
    } else {
      // Validate user's password
      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid password' });
      }

      // Create token for user
      const token = jwt.sign(
        {
          userId: user.id_user,
          username: user.username,
        },
        JWT_SECRET,
        { expiresIn: '4h' } // Set token expiration to 4 hours
      );

      // Send response with user details and token
      return res.json({
        message: 'Login successful',
        token: token,
        user: {
          id_user: user.id_user,
          username: user.username,
        },
      });
    }
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Route to verify token
app.get('/verify-token', verifyToken, (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(500).json({ error: 'Token verification failed' });
  }
});

// GET /user - Get user details using the JWT token
app.get('/user', verifyToken, async (req, res) => {
  try {
    // Get user ID from the decoded token
    const userId = req.user.userId;

    // Query to get user details from the database
    const result = await pool.query('SELECT id_user, username, email FROM users WHERE id_user = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Send a success response with user details
    res.json({
      user: {
        id_user: user.id_user,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// PUT /user - Update user information
app.put('/user', verifyToken, async (req, res) => {
  const { username, email } = req.body;
  const userId = req.user.userId;

  try {
    // Update user details in the database
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2 WHERE id_user = $3 RETURNING id_user, username, email',
      [username, email, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Send a success response with updated user details
    res.json({
      message: 'User information updated successfully',
      user: {
        id_user: user.id_user,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: 'Failed to update user details' });
  }
});

// DELETE /user - Delete user account
app.delete('/user', verifyToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    // Delete user from the database
    const result = await pool.query('DELETE FROM users WHERE id_user = $1 RETURNING id_user', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send a success response
    res.json({
      message: 'User account deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ error: 'Failed to delete user account' });
  }
});

// Route to handle /login/login-berhasil and save data
app.post('/login/login-berhasil', verifyToken, async (req, res) => {
  try {
    // Get user ID from the decoded token
    const userId = req.user.userId;

    // Query to get user details from the database
    const result = await pool.query('SELECT * FROM users WHERE id_user = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Logic to save data based on the user details
    await pool.query('UPDATE users SET last_login = NOW() WHERE id_user = $1', [userId]);

    // Send a success response with user details
    res.json({
      message: 'Data saved successfully',
      user: {
        id_user: user.id_user,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Route to handle logout (optional, for additional cleanup or session management)
app.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Basic Socket.IO setup
io.on('connection', (socket) => {
  console.log('a user connected');

  // Handle user logout event
  socket.on('logout', () => {
    console.log('user logged out');
    socket.disconnect();
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server on port 3003
const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

