const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Admin } = require('../models');
const { protect } = require('../middleware/auth');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Trim whitespace — catches copy/paste issues with credentials
    const trimmedEmail    = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    let admin = await Admin.findOne({ email: trimmedEmail });

    // ── First-time auto-creation ──────────────────────────────────────────────
    // BUG FIX: The original code created the admin doc and then immediately
    // tried comparePassword on it — but the pre-save hook had already hashed
    // the password, so comparing the plain-text password against the newly
    // hashed one always returned false and blocked the very first login.
    // Fix: after auto-creation, return the token directly without comparePassword.
    if (!admin) {
      const envEmail    = (process.env.ADMIN_EMAIL    || '').trim().toLowerCase();
      const envPassword = (process.env.ADMIN_PASSWORD || '').trim();

      if (trimmedEmail === envEmail && trimmedPassword === envPassword) {
        // Create the account — pre-save hook hashes the password
        admin = await Admin.create({
          email:    trimmedEmail,
          password: trimmedPassword,
          name:     'Admin',
        });
        // Sign token immediately — no comparePassword needed on first creation
        const token = jwt.sign(
          { id: admin._id, email: admin.email },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.json({ token, name: admin.name, email: admin.email });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ── Subsequent logins ─────────────────────────────────────────────────────
    // BUG FIX: Original stored email was not lowercased, so "Admin@example.com"
    // and "admin@example.com" were treated as different accounts.
    const passwordOk = await admin.comparePassword(trimmedPassword);
    if (!passwordOk) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, name: admin.name, email: admin.email });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
