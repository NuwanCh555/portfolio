# Nuwan MC — Cyber Security Portfolio

A production-ready, secure portfolio built with **React (Vite) + TailwindCSS** on the frontend and **Node.js / Express** serverless functions on the backend.

---

## 🗂 Project Structure

```
portfolio/
├── frontend/          # React (Vite) + TailwindCSS
│   ├── public/
│   │   ├── profile.jpg
│   │   └── cv.pdf     ← add your CV here
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Hero.jsx
│       │   ├── About.jsx
│       │   ├── Skills.jsx
│       │   ├── Experience.jsx
│       │   ├── Projects.jsx
│       │   ├── Contact.jsx
│       │   └── Footer.jsx
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
├── api/
│   └── contact.js     # Serverless: nodemailer + security middleware
├── server.js          # Local dev server for the API
├── vercel.json        # Vercel deployment config
├── .env.example       # Environment variable template
└── package.json
```

---

## 🚀 Quick Start (Local Development)

### 1. Install all dependencies

```bash
# From portfolio/ root:
cd frontend && npm install && cd ..
npm install
```

### 2. Set up environment variables

```bash
copy .env.example .env
# Edit .env with your Gmail credentials
```

### 3. Run both servers

```bash
# Terminal 1 — Frontend (http://localhost:5173)
cd frontend && npm run dev

# Terminal 2 — Backend API (http://localhost:3001)
node server.js
```

---

## 🛡️ Security Features

| Layer | Feature | Detail |
|---|---|---|
| Frontend | URL Regex Validation | Blocks `http://`, `https://`, `www.`, `.com`, `.net`, `.lk`, `.org`, `.io` |
| Backend | URL Regex Validation | Same regex applied server-side (defence-in-depth) |
| Backend | Rate Limiting | 5 requests per 15 minutes per IP |
| Backend | HTTP Security Headers | `helmet()` — HSTS, CSP, X-Frame-Options, etc. |
| Backend | Strict CORS | Only your Vercel domain + localhost allowed |
| Backend | Payload Size Cap | Body parser limited to 10kb |
| Backend | Field Length Limits | Name ≤100, Email ≤254, Message ≤2000 chars |
| Backend | HTML Sanitisation | XSS-safe email body via character escaping |
| Transport | Gmail SMTP | App Password via environment variables (never in code) |

---

## ☁️ Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — Nuwan MC portfolio"
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. **Root Directory**: leave as `/` (the `vercel.json` handles routing)
4. **Build Command**: `cd frontend && npm run build`
5. **Output Directory**: `frontend/dist`

### 3. Add Environment Variables

In **Vercel Dashboard → Your Project → Settings → Environment Variables**, add:

| Key | Value |
|---|---|
| `EMAIL_USER` | your Gmail address |
| `EMAIL_PASS` | your Gmail App Password |
| `EMAIL_TO` | destination inbox |
| `FRONTEND_URL` | `https://your-project.vercel.app` |

### 4. Get Gmail App Password

1. Enable **2-Factor Authentication** on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Create an App Password → **Mail** → **Other (portfolio)**
4. Copy the 16-character password into `EMAIL_PASS`

---

## 🔧 Customisation

- **Profile photo**: Replace `frontend/public/profile.jpg` with your real photo
- **CV**: Add your CV as `frontend/public/cv.pdf`
- **Projects**: Edit the `projectsData` array in `frontend/src/components/Projects.jsx`
- **Social links**: Update GitHub/LinkedIn URLs in `frontend/src/components/Hero.jsx`
- **Vercel URL in CORS**: Update `ALLOWED_ORIGINS` in `api/contact.js` after deployment
