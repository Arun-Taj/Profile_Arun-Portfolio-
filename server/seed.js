require('dotenv').config();
const mongoose = require('mongoose');
const { Profile, Project, Skill, Experience, Education, Testimonial } = require('./models');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🌱 Connected to MongoDB — Seeding...');

  // Clear existing
  await Promise.all([Profile.deleteMany(), Project.deleteMany(), Skill.deleteMany(), Experience.deleteMany(), Education.deleteMany(), Testimonial.deleteMany()]);

  // Profile
  await Profile.create({
    name: 'Alex Morgan',
    title: 'Full Stack Developer',
    tagline: 'Building the future, one commit at a time.',
    bio: "I'm a passionate Full Stack Developer with 3+ years of experience building scalable web applications using the MERN stack. I love crafting elegant solutions to complex problems.",
    email: 'alex@portfolio.dev',
    phone: '+977 9800000000',
    location: 'Kathmandu, Nepal',
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    },
    stats: { yearsExperience: 3, projectsCompleted: 40, clientsSatisfied: 25, coffeeConsumed: 999 }
  });

  // Skills
  await Skill.insertMany([
    { name: 'React.js', category: 'frontend', proficiency: 92 },
    { name: 'JavaScript ES6+', category: 'frontend', proficiency: 90 },
    { name: 'TypeScript', category: 'frontend', proficiency: 78 },
    { name: 'Tailwind CSS', category: 'frontend', proficiency: 88 },
    { name: 'Node.js', category: 'backend', proficiency: 88 },
    { name: 'Express.js', category: 'backend', proficiency: 85 },
    { name: 'REST API Design', category: 'backend', proficiency: 90 },
    { name: 'MongoDB', category: 'database', proficiency: 85 },
    { name: 'PostgreSQL', category: 'database', proficiency: 72 },
    { name: 'Redis', category: 'database', proficiency: 65 },
    { name: 'Docker', category: 'devops', proficiency: 72 },
    { name: 'AWS (EC2/S3/Lambda)', category: 'devops', proficiency: 68 },
    { name: 'Git & GitHub', category: 'tools', proficiency: 95 },
  ]);

  // Projects
  await Project.insertMany([
    {
      title: 'E-Commerce Platform', featured: true, category: 'web', status: 'completed',
      description: 'Full-featured MERN stack e-commerce platform with real-time inventory, Stripe payment, and admin dashboard.',
      techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redis', 'Docker'],
      liveUrl: 'https://demo.example.com', githubUrl: 'https://github.com', order: 1
    },
    {
      title: 'Real-Time Chat App', featured: true, category: 'web', status: 'completed',
      description: 'WebSocket-based messaging platform supporting rooms, file uploads, and encrypted messages.',
      techStack: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'AWS S3'],
      liveUrl: 'https://demo.example.com', githubUrl: 'https://github.com', order: 2
    },
    {
      title: 'REST API Boilerplate', featured: true, category: 'api', status: 'completed',
      description: 'Production-ready Express.js API template with JWT auth, rate limiting, Swagger docs, and Docker support.',
      techStack: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Swagger', 'Docker'],
      githubUrl: 'https://github.com', order: 3
    },
  ]);

  // Testimonials
  await Testimonial.insertMany([
    {
      name: 'Sarah Johnson', position: 'CTO', company: 'TechVenture Inc.',
      content: "Working with this developer was an absolute pleasure. They delivered our e-commerce platform 2 weeks ahead of schedule with exceptional code quality.",
      rating: 5, featured: true, approved: true,
    },
    {
      name: 'Marcus Chen', position: 'Product Manager', company: 'StartupXYZ',
      content: "One of the most talented full-stack developers I've worked with. The real-time dashboard they built handles thousands of concurrent users flawlessly.",
      rating: 5, featured: true, approved: true,
    },
  ]);

  console.log('✅ Database seeded successfully!');
  mongoose.disconnect();
};

seed().catch(err => { console.error(err); process.exit(1); });
