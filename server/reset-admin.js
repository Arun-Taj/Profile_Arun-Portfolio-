/**
 * reset-admin.js
 * Run this once if you can't log in to the admin dashboard.
 * It deletes any existing admin record and creates a fresh one.
 *
 * Usage:
 *   cd server
 *   node reset-admin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Admin } = require('./models');

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌  MONGO_URI not found in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅  Connected to MongoDB');

  // Delete all existing admin docs
  const deleted = await Admin.deleteMany({});
  console.log(`🗑️   Deleted ${deleted.deletedCount} existing admin record(s)`);

  // Create fresh admin — pre-save hook will hash the password correctly
  const admin = await Admin.create({
    email:    (process.env.ADMIN_EMAIL    || 'admin@portfolio.com').toLowerCase().trim(),
    password: (process.env.ADMIN_PASSWORD || 'Admin@123').trim(),
    name:     'Admin',
  });

  console.log('');
  console.log('🎉  New admin account created:');
  console.log(`    Email:    ${admin.email}`);
  console.log(`    Password: ${(process.env.ADMIN_PASSWORD || 'Admin@123').trim()}`);
  console.log('');
  console.log('👉  You can now log in at http://localhost:3000/admin');

  await mongoose.disconnect();
};

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
