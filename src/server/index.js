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

// GET /healer - Get healer details using the JWT token
app.get('/healer', verifyToken, async (req, res) => {
  try {
    // Get healer ID from the decoded token
    const healerId = req.user.healerId;

    // Query to get healer details from the database
    const result = await pool.query('SELECT id_healer, username, email FROM healer WHERE id_healer = $1', [healerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Healer not found' });
    }

    const healer = result.rows[0];

    // Send a success response with healer details
    res.json({
      healer: {
        id_healer: healer.id_healer,
        username: healer.username,
        email: healer.email,
      },
    });
  } catch (error) {
    console.error('Error fetching healer details:', error);
    res.status(500).json({ error: 'Failed to fetch healer details' });
  }
});

// PUT /healer - Update healer information
app.put('/healer', verifyToken, async (req, res) => {
  const { username, email } = req.body;
  const healerId = req.user.healerId;

  try {
    // Update healer details in the database
    const result = await pool.query(
      'UPDATE healer SET username = $1, email = $2 WHERE id_healer = $3 RETURNING id_healer, username, email',
      [username, email, healerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Healer not found' });
    }

    const healer = result.rows[0];

    // Send a success response with updated healer details
    res.json({
      message: 'Healer information updated successfully',
      healer: {
        id_healer: healer.id_healer,
        username: healer.username,
        email: healer.email,
      },
    });
  } catch (error) {
    console.error('Error updating healer details:', error);
    res.status(500).json({ error: 'Failed to update healer details' });
  }
});

// DELETE /healer - Delete healer account
app.delete('/healer', verifyToken, async (req, res) => {
  const healerId = req.user.healerId;

  try {
    // Delete healer from the database
    const result = await pool.query('DELETE FROM healer WHERE id_healer = $1 RETURNING id_healer', [healerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Healer not found' });
    }

    // Send a success response
    res.json({
      message: 'Healer account deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting healer account:', error);
    res.status(500).json({ error: 'Failed to delete healer account' });
  }
});

// Route to send a message from either a user or a healer
app.post('/send-message', verifyToken, async (req, res) => {
  const { senderType, receiverId, receiverType, messageText } = req.body;
  const senderId = senderType === 'user' ? req.user.userId : req.user.healerId;

  try {
    // Insert message into the database
    const result = await pool.query(
      `INSERT INTO messages (sender_id, sender_type, receiver_id, receiver_type, message_text, timestamp)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id_message`,
      [senderId, senderType, receiverId, receiverType, messageText]
    );

    const messageId = result.rows[0].id_messages;

    // Emit the message to the receiver via Socket.IO
    io.to(receiverId).emit('messages', {
      id: messageId,
      sender_id: senderId,
      sender_type: senderType,
      receiver_id: receiverId,
      receiver_type: receiverType,
      message_text: messageText,
      timestamp: new Date(),
    });

    // Send success response with message ID
    res.status(200).json({ messageId });
  } catch (error) {
    console.error('Message sending failed:', error);
    res.status(500).json({ error: 'Message sending failed' });
  }
});

// Route to retrieve messages between a user and healer
app.get('/messages', verifyToken, async (req, res) => {
  const { withId, withType } = req.query;
  const userId = req.user.userId || null;
  const healerId = req.user.healerId || null;

  try {
    // Query to get messages involving the current user/healer and the specified user/healer
    const result = await pool.query(
      `SELECT * FROM messages 
       WHERE 
         (sender_id = $1 AND sender_type = $2 AND receiver_id = $3 AND receiver_type = $4) 
       OR 
         (sender_id = $3 AND sender_type = $4 AND receiver_id = $1 AND receiver_type = $2)
       ORDER BY timestamp ASC`,
      [userId || healerId, userId ? 'user' : 'healer', withId, withType]
    );

    const messages = result.rows;

    // Send the retrieved messages
    res.json({ messages });
  } catch (error) {
    console.error('Failed to retrieve messages:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('messages', async ({ text, to, from }) => {
    try {
      const senderType = from.startsWith('user') ? 'user' : 'healer';
      const receiverType = to.startsWith('user') ? 'user' : 'healer';
      const senderId = parseInt(from.replace(/\D/g, ''), 10);
      const receiverId = parseInt(to.replace(/\D/g, ''), 10);

      // Store message in the database
      const result = await pool.query(
        `INSERT INTO messages (sender_id, sender_type, receiver_id, receiver_type, message_text, timestamp)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id_message`,
        [senderId, senderType, receiverId, receiverType, text]
      );

      const messageId = result.rows[0].id_message;

      // Emit the message to the recipient
      io.to(to).emit('message', { id: messageId, text, from, timestamp: new Date() });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server on port 3003
const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});