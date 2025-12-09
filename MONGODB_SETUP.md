# MongoDB Database Setup Guide

## Overview
This project now uses **MongoDB** to store player data instead of CSV files. MongoDB provides:
- ✅ Scalable storage for 1000+ players
- ✅ Fast queries and indexing
- ✅ Cloud deployment ready (MongoDB Atlas)
- ✅ Atomic operations
- ✅ Better data integrity

## What Data is Stored

The MongoDB database captures:
- **Codename** - Player's chosen name
- **Email** - Player's email address
- **Score** - Final game score
- **Win/Loss Status** - Whether player won (2+ vaults)
- **Vaults Completed** - Number of vaults cracked
- **Vault Details** - Which specific vaults were completed
- **Session ID** - Unique socket connection ID
- **Time Taken** - Duration of gameplay
- **Timestamps** - Login and completion times
- **IP Address & User Agent** - For analytics

---

## Option 1: Local MongoDB (Development)

### Step 1: Install MongoDB

**Windows:**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer (choose "Complete" setup)
3. Install MongoDB Compass (GUI tool) when prompted
4. MongoDB will run as a Windows service automatically

**Mac (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 2: Verify MongoDB is Running

Open terminal/command prompt:
```bash
mongosh
```

You should see:
```
Current Mongosh Log ID: xxxxx
Connecting to: mongodb://127.0.0.1:27017/?directConnection=true
Using MongoDB: 7.0.0
```

Type `exit` to close.

### Step 3: Configure .env File

Your `.env` file should have:
```env
MONGODB_URI=mongodb://localhost:27017/vaultbreaker
```

### Step 4: Start Server

```bash
npm start
```

You should see:
```
✅ MongoDB connected successfully
📊 Database: vaultbreaker
```

---

## Option 2: MongoDB Atlas (Cloud - Production)

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Choose **FREE tier** (M0 Sandbox - 512MB)

### Step 2: Create a Cluster

1. Click **"Build a Database"**
2. Choose **FREE** tier (Shared)
3. Select cloud provider: **AWS** (or Google Cloud/Azure)
4. Choose region closest to you
5. Cluster Name: `vaultbreaker-cluster`
6. Click **"Create"**

### Step 3: Create Database User

1. Go to **Security** → **Database Access**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `vaultbreaker_user`
5. Password: Generate a strong password (save it!)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Whitelist IP Address

1. Go to **Security** → **Network Access**
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (for testing)
   - Or add specific IPs for production
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go to **Database** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Driver: **Node.js**
4. Version: **4.1 or later**
5. Copy the connection string:

```
mongodb+srv://vaultbreaker_user:<password>@vaultbreaker-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Update .env File

Replace `<password>` with your actual password:

```env
MONGODB_URI=mongodb+srv://vaultbreaker_user:YOUR_PASSWORD_HERE@vaultbreaker-cluster.xxxxx.mongodb.net/vaultbreaker?retryWrites=true&w=majority
```

⚠️ **Important:** 
- Replace `<password>` with actual password
- Add `/vaultbreaker` before the `?` to specify database name

### Step 7: Test Connection

```bash
npm start
```

You should see:
```
✅ MongoDB connected successfully
📊 Database: vaultbreaker
```

---

## Verifying Data is Being Saved

### Using MongoDB Compass (GUI)

1. Open **MongoDB Compass**
2. Connect to:
   - Local: `mongodb://localhost:27017`
   - Atlas: Use your connection string
3. Navigate to database: `vaultbreaker`
4. View collection: `players`
5. You'll see all player records with their data

### Using mongosh (Command Line)

```bash
mongosh "YOUR_CONNECTION_STRING"

# Switch to database
use vaultbreaker

# Count players
db.players.countDocuments()

# View latest 5 players
db.players.find().sort({createdAt: -1}).limit(5).pretty()

# View winners
db.players.find({won: true}).sort({score: -1}).limit(10).pretty()

# View specific player by email
db.players.find({email: "player@example.com"}).pretty()
```

---

## Database Schema

### Player Collection

```javascript
{
  _id: ObjectId("..."),
  codename: "Agent007",
  email: "player@example.com",
  score: 250,
  won: true,
  vaultsCompleted: 3,
  vaultDetails: {
    riddle: true,
    diamondMine: false,
    bollywoodEmoji: true,
    scrambledWords: true,
    generalKnowledge: false
  },
  sessionId: "abc123socket",
  timeTaken: 145, // seconds
  hintsUsed: 2,
  loginTime: ISODate("2024-01-15T10:30:00Z"),
  completionTime: ISODate("2024-01-15T10:32:25Z"),
  faceScanPrediction: "Confident Winner!",
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:32:25Z")
}
```

---

## Useful MongoDB Queries

### Get Leaderboard (Top 10 Winners)
```javascript
db.players.find({won: true})
  .sort({score: -1, completionTime: 1})
  .limit(10)
  .pretty()
```

### Count Total Players
```javascript
db.players.countDocuments()
```

### Count Winners
```javascript
db.players.countDocuments({won: true})
```

### Average Score
```javascript
db.players.aggregate([
  { $group: { _id: null, avgScore: { $avg: "$score" } } }
])
```

### Players by Vault Completion
```javascript
db.players.aggregate([
  { $group: { _id: "$vaultsCompleted", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
])
```

### Export Data to JSON
```bash
mongoexport --uri="YOUR_CONNECTION_STRING" --collection=players --out=players_backup.json
```

### Import Data from JSON
```bash
mongoimport --uri="YOUR_CONNECTION_STRING" --collection=players --file=players_backup.json
```

---

## Deployment on Render.com

### Step 1: Add Environment Variable

1. Go to your Render dashboard
2. Click on your service
3. Go to **Environment** tab
4. Add new environment variable:
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://vaultbreaker_user:PASSWORD@cluster.mongodb.net/vaultbreaker?retryWrites=true&w=majority`
5. Click **"Save Changes"**

### Step 2: Deploy

Render will automatically redeploy with MongoDB connection.

Check logs for:
```
✅ MongoDB connected successfully
📊 Database: vaultbreaker
```

---

## Backup Strategy

### Automatic Backups (MongoDB Atlas)

MongoDB Atlas provides automatic backups:
- **Free tier:** Point-in-time recovery (7 days)
- Backups run daily
- Access via **Backup** tab in Atlas

### Manual Backup

```bash
# Export entire database
mongodump --uri="YOUR_CONNECTION_STRING" --out=./backup

# Restore from backup
mongorestore --uri="YOUR_CONNECTION_STRING" ./backup
```

---

## Troubleshooting

### ❌ "MongoServerError: Authentication failed"
- Check username/password in connection string
- Verify database user has correct permissions
- Re-create database user if needed

### ❌ "MongoServerSelectionError: connection timed out"
- Check Network Access whitelist in Atlas
- Add current IP address
- Verify firewall settings

### ❌ "Server will continue without database (using fallback storage)"
- MongoDB connection failed
- Server will use CSV files instead
- Check MONGODB_URI in .env
- Verify MongoDB is running (local) or accessible (Atlas)

### ❌ "Cannot find module './database'"
- Make sure `database.js` exists in project root
- Restart server after creating file

### ❌ "Cannot find module './models/Player'"
- Create `models` folder
- Create `Player.js` inside models folder
- Restart server

---

## Migration from CSV to MongoDB

### Step 1: Backup Existing Data

Copy your existing CSV files:
```bash
cp players_data.csv players_data_backup.csv
cp games_data.csv games_data_backup.csv
```

### Step 2: Import CSV to MongoDB (Optional)

Create a migration script `migrate_csv_to_mongo.js`:

```javascript
const fs = require('fs');
const mongoose = require('mongoose');
const Player = require('./models/Player');

async function migrate() {
  await mongoose.connect('mongodb://localhost:27017/vaultbreaker');
  
  const csvData = fs.readFileSync('games_data.csv', 'utf8');
  const lines = csvData.split('\n').slice(1); // Skip header
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    const [timestamp, socketId, codename, email, score, vaults, won, timeTaken] = line.split(',');
    
    await Player.create({
      codename: codename.replace(/"/g, ''),
      email: email.replace(/"/g, ''),
      sessionId: socketId,
      score: parseInt(score) || 0,
      vaultsCompleted: parseInt(vaults) || 0,
      won: won === 'Yes',
      timeTaken: parseInt(timeTaken) || 0,
      completionTime: new Date(timestamp)
    });
  }
  
  console.log('Migration complete!');
  process.exit(0);
}

migrate();
```

Run migration:
```bash
node migrate_csv_to_mongo.js
```

---

## Performance Tips

1. **Indexes** - Player model has automatic indexes on:
   - `codename`
   - `email`
   - `sessionId`
   - `score` (for leaderboard)

2. **Connection Pooling** - Mongoose handles this automatically

3. **Query Optimization** - Use `.lean()` for read-only queries:
   ```javascript
   const players = await Player.find().lean();
   ```

4. **Limit Results** - Always use `.limit()` for large datasets

---

## Support

For MongoDB issues:
- MongoDB Docs: https://www.mongodb.com/docs/
- MongoDB University (Free): https://university.mongodb.com/
- Community Forums: https://www.mongodb.com/community/forums/

For Atlas issues:
- Atlas Docs: https://www.mongodb.com/docs/atlas/
- Support Chat: Available in Atlas dashboard
