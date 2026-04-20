# 🚀 Full Stack Developer Portfolio — React + Vite + Tailwind CSS

A complete, production-ready personal portfolio built with the **MERN stack**, using **Vite** as the build tool and **Tailwind CSS** for styling. Same dark futuristic neon design — faster, cleaner, more modern tooling.

---

## ⚡ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router v6           |
| Build Tool | **Vite 5** (replaces Create React App) |
| Styling    | **Tailwind CSS 3** (replaces custom CSS) |
| Icons      | Lucide React                        |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB + Mongoose                  |
| Auth       | JWT (jsonwebtoken) + bcryptjs       |
| Email      | Nodemailer + Gmail SMTP             |
| Security   | Helmet, express-rate-limit, CORS    |

---

## ✨ Features

- **Hero** — Particle canvas animation, typewriter effect, stat cards
- **About** — Avatar, bio, contact info, highlight cards
- **Skills** — Category filter + animated progress bars (IntersectionObserver)
- **Experience** — Expandable accordion timeline
- **Projects** — Filterable grid, hover overlay, detail page
- **Education** — Card grid with primary degree highlight
- **Testimonials** — Carousel with dot navigation + mini previews
- **Contact** — Full form with email send + auto-reply (Nodemailer)
- **Admin CMS** — JWT-protected dashboard to manage all content

---

## 📁 Project Structure

```
portfolio-mern-vite/
├── client/                        # React + Vite frontend
│   ├── index.html                 # Vite entry point
│   ├── vite.config.js             # Vite config (port 3000, API proxy)
│   ├── tailwind.config.js         # Tailwind design tokens
│   ├── postcss.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx               # React entry
│       ├── App.jsx                # Router setup
│       ├── index.css              # Tailwind directives + component classes
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Hero.jsx
│       │   ├── About.jsx
│       │   ├── Skills.jsx
│       │   ├── Experience.jsx
│       │   ├── Projects.jsx
│       │   ├── Education.jsx
│       │   ├── Testimonials.jsx
│       │   ├── Contact.jsx
│       │   └── Footer.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── ProjectDetail.jsx
│       │   ├── AdminLogin.jsx
│       │   └── AdminDashboard.jsx
│       ├── hooks/
│       │   └── useAuth.jsx
│       └── utils/
│           └── api.js             # Axios API utility
│
└── server/                        # Express backend (unchanged)
    ├── index.js
    ├── config/db.js
    ├── models/index.js
    ├── middleware/
    ├── routes/
    └── seed.js
```

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js v18+**
- **MongoDB** (local) or a free [MongoDB Atlas](https://cloud.mongodb.com) account
- A Gmail account (for the contact form email feature)

---

### Step 1 — Extract & Install

```bash
# Extract the zip, then:
cd portfolio-mern-vite

# Install all dependencies (root + client + server)
npm run install-all
```

---

### Step 2 — Configure the Backend `.env`

```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill in:

```env
PORT=5000
NODE_ENV=development

# MongoDB — use Atlas (cloud) or local
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio

# JWT — generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_64_char_random_string_here

# Gmail SMTP (requires 2FA + App Password)
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_16_char_app_password
EMAIL_TO=your.email@gmail.com

# Admin login for /admin dashboard
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=YourStrongPassword@123
```

**Gmail App Password steps:**
1. Enable 2FA at myaccount.google.com/security
2. Go to myaccount.google.com/apppasswords
3. Generate → "Mail" → copy the 16-character password (no spaces)

---

### Step 3 — Seed Sample Data (Optional)

```bash
cd server
node seed.js
```

This populates MongoDB with sample projects, skills, experiences, and testimonials so the site looks complete immediately.

---

### Step 4 — Run

**Frontend only** (no backend needed — uses demo data fallbacks):
```bash
cd client
npm run dev
# → http://localhost:3000
```

**Full stack** (from root folder):
```bash
npm run dev
# Frontend → http://localhost:3000
# Backend  → http://localhost:5000
```

---

## 🔗 Key URLs

| URL                              | Description                     |
|----------------------------------|---------------------------------|
| `http://localhost:3000`          | Portfolio site                  |
| `http://localhost:3000/admin`    | Admin CMS login                 |
| `http://localhost:5000/api/health` | Backend health check          |
| `http://localhost:5000/api/projects` | Projects API (public)       |

---

## 🎨 Tailwind Customization

All design tokens are in `client/tailwind.config.js`:

```js
colors: {
  'neon-cyan':    '#00f5ff',   // primary accent
  'neon-purple':  '#7c3aed',   // secondary accent
  'neon-pink':    '#f72585',   // highlight
  'neon-green':   '#39ff14',   // success/available
  'bg-primary':   '#050508',   // page background
  'bg-secondary': '#0d0d1a',   // section background
  'bg-card':      '#0f0f1e',   // card background
}
```

Change any color here and it applies globally across all components.

Component utility classes (`.btn-primary`, `.card-base`, `.badge-cyan`, `.form-input`, etc.) are defined in `client/src/index.css` under `@layer components`.

---

## 🚀 Production Build

```bash
# Build the React frontend
npm run build
# Output: client/dist/

# Deploy client/dist/ to: Vercel, Netlify, or any static host
# Deploy server/ to: Railway, Render, Fly.io, or DigitalOcean

# Set these env vars on your hosting platform:
# REACT_APP_API_URL = https://your-api-domain.com/api  (Vercel/Netlify)
# CLIENT_URL        = https://your-portfolio-domain.com (server CORS)
```

---

## 🔐 Admin Dashboard

Login at `/admin` with your `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`.

**What you can manage:**
- ✅ Profile (name, bio, photo, social links, resume URL)
- ✅ Projects (CRUD + featured flag + live/demo links)
- ✅ Skills (name, category, proficiency %)
- ✅ Experience (timeline entries with achievements)
- ✅ Education (degrees, certifications)
- ✅ Testimonials (approve/unapprove visibility)
- ✅ Messages (read, reply via email, mark replied, delete)

---

## 🛠️ Why Vite over CRA?

| Feature            | Create React App | Vite         |
|--------------------|-----------------|--------------|
| Dev server start   | ~5–15 seconds   | < 1 second   |
| HMR (hot reload)   | Slow (webpack)  | Instant      |
| Build time         | Slow            | 10x faster   |
| Bundle size        | Larger          | Smaller      |
| Config complexity  | Hidden          | Transparent  |
| Maintenance        | Deprecated      | Actively maintained |

---

## 📄 License

MIT — Free to use for your personal portfolio.
