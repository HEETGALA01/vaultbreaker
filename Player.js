// Player Model
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    codename: String,
    email: String,
    sessionId: String,
    score: { type: Number, default: 0 },
    won: { type: Boolean, default: false },
    vaultsCompleted: { type: Number, default: 0 },
    vaultDetails: {
        riddle: { type: Boolean, default: false },
        diamondMine: { type: Boolean, default: false },
        bollywoodEmoji: { type: Boolean, default: false },
        scrambledWords: { type: Boolean, default: false },
        generalKnowledge: { type: Boolean, default: false }
    },
    timeTaken: Number,
    loginTime: { type: Date, default: Date.now },
    completionTime: Date,
    ipAddress: String,
    userAgent: String
}, {
    timestamps: true
});

// Index for faster queries
playerSchema.index({ email: 1 });
playerSchema.index({ score: -1 });

module.exports = mongoose.model('Player', playerSchema);
