const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  findUserByUsername,
  findUserById,
  createUser,
  addRefreshToken,
  hasRefreshToken,
  deleteRefreshToken,
} = require('../db');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

function generateTokens(user) {
  const payload = { userId: user.id, username: user.username };

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES,
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
  });

  return { accessToken, refreshToken };
}


// POST /auth/register

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'username dan password wajib diisi' });
    }

    const existing = await findUserByUsername(username);
    if (existing) {
      return res.status(409).json({ message: 'Username sudah dipakai' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await createUser(username, passwordHash);

    res.status(201).json({ message: 'Registrasi berhasil', userId: newUser.id });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan di server' });
  }
});

// POST /auth/login

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'username dan password wajib diisi' });
    }

    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    await addRefreshToken(refreshToken, user.id); // catat refresh token ini sebagai valid di DB

    res.json({
      message: 'Login berhasil',
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan di server' });
  }
});

// POST /auth/refresh-token

router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token tidak ditemukan' });
    }

    const isRegistered = await hasRefreshToken(refreshToken);
    if (!isRegistered) {
      return res.status(403).json({ message: 'Refresh token tidak valid atau sudah logout' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      await deleteRefreshToken(refreshToken);
      return res.status(403).json({ message: 'Refresh token expired, silakan login ulang' });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId, username: decoded.username },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES }
    );

    res.json({ accessToken });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan di server' });
  }
});

// POST /auth/logout

router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await deleteRefreshToken(refreshToken);
    res.json({ message: 'Logout berhasil' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan di server' });
  }
});

// GET /auth/profile  (protected route)

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json({
      message: 'Ini data profile yang cuma bisa diakses kalau sudah login',
      user,
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan di server' });
  }
});

module.exports = router;
