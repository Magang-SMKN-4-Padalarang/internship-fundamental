const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// USERS

async function findUserByUsername(username) {
  const [rows] = await pool.query(
    'SELECT id, username, password_hash AS passwordHash FROM users WHERE username = ? LIMIT 1',
    [username]
  );
  return rows[0] || null;
}

async function findUserById(id) {
  const [rows] = await pool.query(
    'SELECT id, username FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

async function createUser(username, passwordHash) {
  const [result] = await pool.query(
    'INSERT INTO users (username, password_hash) VALUES (?, ?)',
    [username, passwordHash]
  );
  return { id: result.insertId, username };
}

// REFRESH TOKENS

async function addRefreshToken(token, userId) {
  await pool.query(
    'INSERT INTO refresh_tokens (token, user_id) VALUES (?, ?)',
    [token, userId]
  );
}

async function hasRefreshToken(token) {
  const [rows] = await pool.query(
    'SELECT id FROM refresh_tokens WHERE token = ? LIMIT 1',
    [token]
  );
  return rows.length > 0;
}

async function deleteRefreshToken(token) {
  await pool.query('DELETE FROM refresh_tokens WHERE token = ?', [token]);
}

module.exports = {
  pool,
  findUserByUsername,
  findUserById,
  createUser,
  addRefreshToken,
  hasRefreshToken,
  deleteRefreshToken,
};
