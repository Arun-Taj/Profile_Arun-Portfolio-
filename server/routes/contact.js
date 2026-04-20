const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { Contact } = require('../models');
const { protect } = require('../middleware/auth');

const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /api/contact — Send a message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Save to DB
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip
    });

    // Send email notification
    try {
      const transporter = createTransporter();

      // Email to portfolio owner
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `📬 New Message: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #00f5ff, #7c3aed); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 24px;">New Portfolio Message</h1>
            </div>
            <div style="padding: 30px;">
              <p><strong style="color: #00f5ff;">From:</strong> ${name} (${email})</p>
              <p><strong style="color: #00f5ff;">Subject:</strong> ${subject}</p>
              <div style="background: #1a1a2e; border-left: 4px solid #00f5ff; padding: 20px; border-radius: 0 8px 8px 0; margin: 20px 0;">
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
              <p style="color: #64748b; font-size: 12px;">Received on ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `
      });

      // Auto-reply to sender
      await transporter.sendMail({
        from: `"Portfolio" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Thanks for reaching out, ${name}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #00f5ff, #7c3aed); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: white;">Message Received!</h1>
            </div>
            <div style="padding: 30px;">
              <p>Hi <strong>${name}</strong>,</p>
              <p>Thanks for getting in touch! I've received your message and will get back to you within 24–48 hours.</p>
              <div style="background: #1a1a2e; border-left: 4px solid #7c3aed; padding: 20px; border-radius: 0 8px 8px 0; margin: 20px 0;">
                <p style="margin: 0; color: #94a3b8; font-style: italic;">"${message.substring(0, 150)}${message.length > 150 ? '...' : ''}"</p>
              </div>
              <p>Best regards,<br><strong style="color: #00f5ff;">Full Stack Developer</strong></p>
            </div>
          </div>
        `
      });
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr.message);
      // Still return success — message is saved to DB
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! I\'ll get back to you soon.',
      id: contact._id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/contact — Admin: get all messages
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Contact.countDocuments(query);
    res.json({ messages, total, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/contact/:id/status — Update message status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const msg = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(msg);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/contact/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
