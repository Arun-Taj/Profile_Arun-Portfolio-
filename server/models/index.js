const mongoose = require('mongoose');

// ─── Profile Model ────────────────────────────────────────────────────────────
const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  tagline: { type: String },
  bio: { type: String, required: true },
  avatar: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  resumeUrl: { type: String },
  social: {
    github: String,
    linkedin: String,
    twitter: String,
    instagram: String,
    youtube: String,
    website: String
  },
  stats: {
    yearsExperience: Number,
    projectsCompleted: Number,
    clientsSatisfied: Number,
    coffeeConsumed: Number
  }
}, { timestamps: true });

// ─── Project Model ────────────────────────────────────────────────────────────
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  thumbnail: { type: String },
  images: [String],
  techStack: [String],
  category: {
    type: String,
    enum: ['web', 'mobile', 'api', 'ml', 'devops', 'other'],
    default: 'web'
  },
  liveUrl: { type: String },
  githubUrl: { type: String },
  demoVideoUrl: { type: String },
  featured: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'planned'],
    default: 'completed'
  },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// ─── Skill Model ──────────────────────────────────────────────────────────────
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'database', 'devops', 'tools', 'languages', 'other'],
    required: true
  },
  proficiency: { type: Number, min: 0, max: 100, required: true },
  icon: { type: String },
  color: { type: String },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// ─── Experience Model ─────────────────────────────────────────────────────────
const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'freelance', 'contract', 'internship'],
    default: 'full-time'
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String },
  achievements: [String],
  techUsed: [String],
  companyLogo: { type: String },
  companyUrl: { type: String }
}, { timestamps: true });

// ─── Education Model ──────────────────────────────────────────────────────────
const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  grade: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String },
  achievements: [String],
  logo: { type: String },
  location: { type: String }
}, { timestamps: true });

// ─── Testimonial Model ────────────────────────────────────────────────────────
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  company: { type: String },
  avatar: { type: String },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  linkedinUrl: { type: String },
  featured: { type: Boolean, default: false },
  approved: { type: Boolean, default: false }
}, { timestamps: true });

// ─── Contact Message Model ────────────────────────────────────────────────────
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied', 'archived'],
    default: 'unread'
  },
  ipAddress: { type: String }
}, { timestamps: true });

// ─── Admin User Model ─────────────────────────────────────────────────────────
const bcrypt = require('bcryptjs');
const adminSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name:     { type: String, default: 'Admin' }
}, { timestamps: true });

// Hash password only when it is newly set or changed
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = {
  Profile: mongoose.model('Profile', profileSchema),
  Project: mongoose.model('Project', projectSchema),
  Skill: mongoose.model('Skill', skillSchema),
  Experience: mongoose.model('Experience', experienceSchema),
  Education: mongoose.model('Education', educationSchema),
  Testimonial: mongoose.model('Testimonial', testimonialSchema),
  Contact: mongoose.model('Contact', contactSchema),
  Admin: mongoose.model('Admin', adminSchema),
};
