const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Shinecampushub',
  password: 'admin123',
  port: 5432,
});

const insertUser = async (email, username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO users (email, username, password) VALUES ($1, $2, $3)',
    [email, username, hashedPassword]
  );
  console.log('User inserted:', email);
};

const insertSampleData = async () => {
  try {
    await insertUser('user1@example.com', 'user1', 'password1234');
    await insertUser('user2@example.com', 'user2', 'password5678');

    // Insert sample messages
    await pool.query(
      'INSERT INTO messages (sender_id, recipient_id, text) VALUES ($1, $2, $3)',
      [1, 2, 'Hello User2']
    );
    await pool.query(
      'INSERT INTO messages (sender_id, recipient_id, text) VALUES ($1, $2, $3)',
      [2, 1, 'Hi User1, How are you?']
    );

    // Insert sample contacts
    await pool.query(
      'INSERT INTO user_contacts (user_id, contact_id) VALUES ($1, $2)',
      [1, 2]
    );
    await pool.query(
      'INSERT INTO user_contacts (user_id, contact_id) VALUES ($1, $2)',
      [2, 1]
    );

    console.log('Sample data inserted');
  } catch (err) {
    console.error('Error inserting sample data:', err);
  } finally {
    pool.end();
  }
};

insertSampleData();
