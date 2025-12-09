# MongoDB Integration - Quick Start

## ✅ What Was Added

MongoDB database integration has been successfully added to Vault Breaker! 

### New Files Created:
1. **`database.js`** - MongoDB connection configuration
2. **`models/Player.js`** - Player data schema/model
3. **`MONGODB_SETUP.md`** - Complete setup guide

### Modified Files:
1. **`server.js`** - Updated to use MongoDB for data storage
2. **`.env`** - Added MONGODB_URI configuration
3. **`package.json`** - Added MongoDB dependencies

---

## 🚀 Quick Setup (3 Steps)

### 1. Install Dependencies (Already Done)
```bash
npm install
```

### 2. Start MongoDB Locally

**Option A: If you have MongoDB installed:**
- It should be running automatically as a service

**Option B: Don't have MongoDB yet?**
- Download from: https://www.mongodb.com/try/download/community
- OR use MongoDB Atlas (cloud) - see `MONGODB_SETUP.md`

### 3. Start the Server
```bash
npm start
```

Look for this confirmation:
```
✅ MongoDB connected successfully
📊 Database: vaultbreaker
```

---

## 📊 What Data Gets Stored

Every time a player plays the game, MongoDB stores:

```javascript
{
  codename: "Agent007",           // Player's name
  email: "player@example.com",    // Player's email
  score: 250,                     // Final score
  won: true,                      // Did they win? (2+ vaults)
  vaultsCompleted: 3,             // Number of vaults completed
  vaultDetails: {                 // Which vaults were completed
    riddle: true,
    diamondMine: false,
    bollywoodEmoji: true,
    scrambledWords: true,
    generalKnowledge: false
  },
  sessionId: "abc123",            // Unique session ID
  timeTaken: 145,                 // Seconds to complete
  loginTime: "2024-01-15...",     // When they started
  completionTime: "2024-01-15...", // When they finished
  ipAddress: "192.168.1.1",       // Player's IP
  userAgent: "Mozilla/5.0..."     // Browser info
}
```

---

## 🔍 View Your Data

### Using MongoDB Compass (GUI)
1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Open database: `vaultbreaker`
4. View collection: `players`
5. See all player records!

### Using Command Line
```bash
mongosh

use vaultbreaker
db.players.find().pretty()
db.players.countDocuments()  // Total players
db.players.find({won: true}) // Only winners
```

---

## ⚙️ Configuration

### Local Development (Default)
```env
MONGODB_URI=mongodb://localhost:27017/vaultbreaker
```

### MongoDB Atlas (Cloud/Production)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vaultbreaker?retryWrites=true&w=majority
```

See `MONGODB_SETUP.md` for complete Atlas setup guide.

---

## 🛡️ Fallback Protection

**The server is smart!**

- ✅ If MongoDB is connected → Data saved to MongoDB + CSV backup
- ⚠️ If MongoDB fails → Data saved to CSV files only (legacy mode)
- ✅ No data loss - the game keeps running!

You'll see this in logs:
```
✅ Player login saved to MongoDB: Agent007
✅ Game completion saved to MongoDB: Agent007 - Score: 250
```

Or fallback mode:
```
⚠️ Server will continue without database (using fallback storage)
Player login saved to CSV (fallback): Agent007
```

---

## 📈 Benefits Over CSV Files

| Feature | CSV Files | MongoDB |
|---------|-----------|---------|
| Speed | Slow for 1000+ players | Fast with indexing |
| Queries | Manual parsing | Built-in queries |
| Scalability | Limited | Unlimited |
| Cloud Ready | No | Yes (Atlas) |
| Data Integrity | Manual | Automatic validation |
| Concurrent Writes | Can corrupt | Atomic operations |

---

## 🔧 Troubleshooting

### "MongoDB connection failed"
1. Check if MongoDB is running: `mongosh`
2. Verify MONGODB_URI in `.env`
3. Server will use CSV fallback automatically

### "Cannot find module './database'"
```bash
# Make sure all new files exist
ls database.js
ls models/Player.js
```

### Want to use MongoDB Atlas (Cloud)?
Read the complete guide: **`MONGODB_SETUP.md`**

---

## 📚 Learn More

- **Complete Setup Guide:** `MONGODB_SETUP.md`
- **MongoDB Docs:** https://www.mongodb.com/docs/
- **Mongoose Docs:** https://mongoosejs.com/docs/

---

## 🎯 Next Steps

1. ✅ Server is running with MongoDB
2. 🎮 Play the game - data auto-saves to MongoDB
3. 🔍 View data in MongoDB Compass
4. 📊 Query player statistics
5. ☁️ Optional: Deploy to MongoDB Atlas (cloud)

---

## Support

If MongoDB connection fails, the game will still work using CSV files. 

For detailed MongoDB setup including cloud deployment, see: **`MONGODB_SETUP.md`**
