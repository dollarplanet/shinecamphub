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

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'Shinecampushub',
  password: process.env.DB_PASSWORD || 'admin123',
  port: process.env.DB_PORT || 5432,
});

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token correctly

  if (!token) {
    return res.status(401).json({ error: 'Access denied, token missing!' });
  } else {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token invalid!' });
      } else {
        req.user = decoded;
        next();
      }
    });
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
});

app.post('/register', upload.single('studentProof'), async (req, res) => {
  const { username, email, password, campusName } = req.body;
  const studentProof = req.file ? req.file.buffer : null;

  try {
    // Check if email or username already exists
    const emailCheck = await pool.query('SELECT id_user FROM users WHERE email = $1', [email]);
    const usernameCheck = await pool.query('SELECT id_user FROM users WHERE username = $1', [username]);
    
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user data into the database
    const result = await pool.query(
      `INSERT INTO users (username, password, email, nama_kampus, upload_bukti_mahasiswa_aktif) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id_user`,
      [username, hashedPassword, email, campusName, studentProof]
    );

    const userId = result.rows[0].id_user;

    // Send success response
    res.status(200).json({ userId });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/register/healer', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const usernameCheck = await pool.query('SELECT id_healer FROM healer WHERE username = $1', [username]);
    const emailCheck = await pool.query('SELECT id_healer FROM healer WHERE email = $1', [email]);

    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO healer (username, email, password) 
       VALUES ($1, $2, $3) RETURNING id_healer`,
      [username, email, hashedPassword]
    );

    const healerId = result.rows[0].id_healer;

    res.status(200).json({ healerId });
  } catch (error) {
    console.error('Healer registration failed:', error);
    res.status(500).json({ error: 'Healer registration failed' });
  }
});

app.post('/login', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    let result = await pool.query('SELECT id_user, username, password FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      result = await pool.query('SELECT id_healer, username, password FROM healer WHERE email = $1', [email]);

      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      const healer = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, healer.password);

      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid password' });
      }

      const token = jwt.sign(
        {
          healerId: healer.id_healer,
          username: healer.username,
        },
        JWT_SECRET,
        { expiresIn: '4h' }
      );

      return res.json({
        message: 'Login successful',
        token: token,
        healer: {
          id_healer: healer.id_healer,
          username: healer.username,
        },
      });
    } else {
      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid password' });
      }

      const token = jwt.sign(
        {
          userId: user.id_user,
          username: user.username,
        },
        JWT_SECRET,
        { expiresIn: '4h' }
      );

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

// Verify and get user or healer details
app.get('/verify-token', verifyToken, async (req, res) => {
  try {
    if (req.user.userId) {
      const result = await pool.query('SELECT username FROM users WHERE id_user = $1', [req.user.userId]);
      return res.json({ user: result.rows[0] });
    } else if (req.user.healerId) {
      const result = await pool.query('SELECT username FROM healer WHERE id_healer = $1', [req.user.healerId]);
      return res.json({ healer: result.rows[0] });
    } else {
      return res.status(404).json({ error: 'User or Healer not found' });
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(500).json({ error: 'Token verification failed' });
  }
});


app.get('/user', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query('SELECT id_user, username, email FROM users WHERE id_user = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

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

app.put('/user', verifyToken, async (req, res) => {
  const { username, email } = req.body;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2 WHERE id_user = $3 RETURNING id_user, username, email',
      [username, email, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

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

app.delete('/user', verifyToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query('DELETE FROM users WHERE id_user = $1 RETURNING id_user', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User account deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ error: 'Failed to delete user account' });
  }
});

app.get('/healer', verifyToken, async (req, res) => {
  try {
    const healerId = req.user.healerId;

    const result = await pool.query('SELECT id_healer, username, email FROM healer WHERE id_healer = $1', [healerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Healer not found' });
    }

    const healer = result.rows[0];

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

app.put('/healer', verifyToken, async (req, res) => {
  const { username, email } = req.body;
  const healerId = req.user.healerId;

  try {
    const result = await pool.query(
      'UPDATE healer SET username = $1, email = $2 WHERE id_healer = $3 RETURNING id_healer, username, email',
      [username, email, healerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Healer not found' });
    }

    const healer = result.rows[0];

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

app.delete('/healer', verifyToken, async (req, res) => {
  const healerId = req.user.healerId;

  try {
    const result = await pool.query('DELETE FROM healer WHERE id_healer = $1 RETURNING id_healer', [healerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Healer not found' });
    }

    res.json({
      message: 'Healer account deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting healer account:', error);
    res.status(500).json({ error: 'Failed to delete healer account' });
  }
});

const isUserOrHealer = async (name) => {
  const userCheck = await pool.query('SELECT id_user FROM users WHERE username = $1', [name]);
  if (userCheck.rows.length > 0) return { id: userCheck.rows[0].id_user, isUser: true };

  const healerCheck = await pool.query('SELECT id_healer FROM healer WHERE username = $1', [name]);
  if (healerCheck.rows.length > 0) return { id: healerCheck.rows[0].id_healer, isUser: false };

  return null;
};

// Fetch messages between user and healer
app.get('/messages', verifyToken, async (req, res) => {
  const { withName } = req.query;
  const senderName = req.user.username;

  try {
    if (!withName) {
      return res.status(400).json({ error: 'Recipient name is missing in the query parameter' });
    }

    const recipient = await isUserOrHealer(withName);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const result = await pool.query(
      `SELECT * FROM messages 
       WHERE 
         (sender_name = $1 AND receiver_name = $2) 
       OR 
         (sender_name = $2 AND receiver_name = $1)
       ORDER BY timestamp ASC`,
      [senderName, withName]
    );

    const messages = result.rows;
    res.json({ messages });
  } catch (error) {
    console.error('Failed to retrieve messages:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
});

// Send message between user and healer
app.post('/send-message', verifyToken, async (req, res) => {
  const { receiverName, messageText, receiverType } = req.body;
  const senderName = req.user.username;

  // Validate input data
  if (!senderName || !receiverName || !messageText || !receiverType) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  // Ensure receiverType is either 'user' or 'healer'
  if (receiverType !== 'user' && receiverType !== 'healer') {
    return res.status(400).json({ error: 'Invalid receiver type' });
  }

  try {
    // Check if recipient exists and get recipient type
    const recipient = await isUserOrHealer(receiverName);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Ensure that sender and receiver are not of the same type
    if (req.user.userId && recipient.isUser) {
      return res.status(400).json({ error: 'Cannot send message to another user as a user.' });
    }

    if (req.user.healerId && !recipient.isUser) {
      return res.status(400).json({ error: 'Cannot send message to another healer as a healer.' });
    }

    const result = await pool.query(
      `INSERT INTO messages (sender_name, receiver_name, message_text, timestamp, receiver_type)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4) RETURNING id_message`,
      [senderName, receiverName, messageText, receiverType]
    );

    console.log('Message saved:', result.rows[0].id_message);

    // Emit the message to the receiver using Socket.IO
    io.to(receiverName).emit('message', {
      id_message: result.rows[0].id_message,
      sender_name: senderName,
      receiver_name: receiverName,
      message_text: messageText,
      timestamp: new Date(),
      receiver_type: receiverType,
    });

    res.status(200).json({ messageId: result.rows[0].id_message });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ error: 'Message sending failed due to database issue.' });
  }
});


// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle message sending through Socket.IO
  socket.on('message', async ({ text, to, from, receiverType }) => {  // Tambahkan receiverType
    try {
      // Ensure receiverType is either 'user' or 'healer'
      if (receiverType !== 'user' && receiverType !== 'healer') {
        socket.emit('error', { message: 'Invalid receiver type' });
        return;
      }

      const result = await pool.query(
        `INSERT INTO messages (sender_name, receiver_name, message_text, timestamp, receiver_type)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4) RETURNING id_message`,  // Tambahkan receiverType
        [from, to, text, receiverType]
      );

      console.log('Message saved via socket:', result.rows[0].id_message);

      // Emit the message to the receiver
      io.to(to).emit('message', {
        id_message: result.rows[0].id_message,
        sender_name: from,
        receiver_name: to,
        message_text: text,
        timestamp: new Date(),
        receiver_type: receiverType,  // Sertakan receiverType
      });
    } catch (error) {
      console.error('Error sending message via socket:', error);
      socket.emit('error', { message: 'Failed to send message. Please try again later.' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});