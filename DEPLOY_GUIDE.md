# Vault Breaker Deployment Guide

## Problem
Netlify is a static hosting platform and cannot run Node.js servers. Your game needs a backend server for:
- Real-time leaderboard
- Active player count
- Socket.io connections
- Admin dashboard

## Solution: Deploy Backend + Frontend Separately

### Step 1: Deploy Backend to Render.com (Free)

1. **Create a Render account**: Go to https://render.com and sign up

2. **Create a new Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository (or upload files)
   - Configure:
     - **Name**: `vault-breaker-server`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
     - **Plan**: Free

3. **Add Environment Variables** (in Render dashboard):
   - `PORT` = `10000` (Render's default)
   - `OPENAI_API_KEY` = your key (optional)
   - `ADMIN_PASSWORD` = your admin password
   - `EMAIL_USER` = your email (optional)
   - `EMAIL_PASS` = your email password (optional)

4. **Deploy**: Click "Create Web Service"

5. **Get your server URL**: After deployment, you'll get a URL like:
   `https://vault-breaker-server.onrender.com`

### Step 2: Update Frontend Code

In `game.js`, find this line (around line 320):
```javascript
const PRODUCTION_SERVER_URL = '';
```

Change it to your Render URL:
```javascript
const PRODUCTION_SERVER_URL = 'https://vault-breaker-server.onrender.com';
```

### Step 3: Update Admin Dashboard

In `admin.js`, find similar server URL configuration and update it.

### Step 4: Redeploy to Netlify

Push your changes and redeploy to Netlify.

---

## Alternative: Deploy Everything to Render

Instead of using Netlify, you can host everything on Render:

1. Deploy as above
2. Your game will be available at: `https://vault-breaker-server.onrender.com`
3. Admin dashboard: `https://vault-breaker-server.onrender.com/admin.html`

---

## File Structure for Deployment

Make sure these files are included:
```
vault-breaker/
├── server.js          # Backend server (for Render)
├── package.json       # Dependencies
├── index.html         # Game frontend
├── admin.html         # Admin dashboard
├── game.js           # Game logic
├── admin.js          # Admin logic
├── styles.css        # Styles
├── admin-styles.css  # Admin styles
└── .env              # Environment variables (don't commit!)
```

---

## Testing Locally

1. Run `npm install`
2. Run `node server.js`
3. Open `http://localhost:3000`

---

## Notes

- **Free Tier Limitations**: Render's free tier spins down after 15 minutes of inactivity. First request after sleep takes ~30 seconds.
- **Upgrade for Production**: For a live event with 1000+ players, consider upgrading to a paid plan.
