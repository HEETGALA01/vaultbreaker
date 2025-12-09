// ========================================
// PLAYER MODEL - MONGOOSE SCHEMA
// ========================================

const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    // Player Identity
    codename: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true
    },
    
    // Game Performance
    score: {
        type: Number,
        default: 0,
        min: 0
    },
    
    won: {
        type: Boolean,
        default: false
    },
    
    vaultsCompleted: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    
    // Vault Details (which vaults were completed)
    vaultDetails: {
        riddle: { type: Boolean, default: false },
        diamondMine: { type: Boolean, default: false },
        bollywoodEmoji: { type: Boolean, default: false },
        scrambledWords: { type: Boolean, default: false },
        generalKnowledge: { type: Boolean, default: false }
    },
    
    // Game Metadata
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    
    timeTaken: {
        type: Number, // in seconds
        default: 0
    },
    
    hintsUsed: {
        type: Number,
        default: 0
    },
    
    // Timestamps
    loginTime: {
        type: Date,
        default: Date.now
    },
    
    completionTime: {
        type: Date
    },
    
    // Face Scan Data
    faceScanPrediction: {
        type: String,
        default: null
    },
    
    // Additional Metadata
    ipAddress: {
        type: String
    },
    
    userAgent: {
        type: String
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt
    collection: 'players'
});

// Indexes for better query performance
playerSchema.index({ score: -1 }); // For leaderboard queries
playerSchema.index({ createdAt: -1 }); // For recent players
playerSchema.index({ sessionId: 1, email: 1 }); // For unique session tracking

// Virtual for game duration
playerSchema.virtual('gameDuration').get(function() {
    if (this.completionTime && this.loginTime) {
        return Math.round((this.completionTime - this.loginTime) / 1000); // in seconds
    }
    return 0;
});

// Static method: Get leaderboard
playerSchema.statics.getLeaderboard = async function(limit = 10) {
    return this.find({ won: true })
        .sort({ score: -1, completionTime: 1 })
        .limit(limit)
        .select('codename email score vaultsCompleted completionTime')
        .lean();
};

// Static method: Get player stats
playerSchema.statics.getPlayerStats = async function(email) {
    return this.findOne({ email: email })
        .sort({ createdAt: -1 })
        .lean();
};

// Static method: Count total players
playerSchema.statics.getTotalPlayers = async function() {
    return this.countDocuments();
};

// Static method: Count winners
playerSchema.statics.getTotalWinners = async function() {
    return this.countDocuments({ won: true });
};

// Instance method: Mark as completed
playerSchema.methods.markCompleted = function(vaultsCompleted, score, vaultDetails) {
    this.vaultsCompleted = vaultsCompleted;
    this.score = score;
    this.won = vaultsCompleted >= 2; // Win condition: 2 or more vaults
    this.completionTime = new Date();
    
    if (vaultDetails) {
        this.vaultDetails = vaultDetails;
    }
    
    return this.save();
};

// Pre-save hook: Validate email format
playerSchema.pre('save', function(next) {
    if (this.email && !this.email.includes('@')) {
        return next(new Error('Invalid email format'));
    }
    next();
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
