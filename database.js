// ========================================
// MONGODB DATABASE CONFIGURATION
// ========================================

const mongoose = require('mongoose');

// MongoDB Connection Options
const mongoOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

// Connect to MongoDB
async function connectDatabase() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vaultbreaker';
        
        await mongoose.connect(MONGODB_URI, mongoOptions);
        
        console.log('✅ MongoDB connected successfully');
        console.log(`📊 Database: ${mongoose.connection.name}`);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });
        
        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });
        
        return mongoose.connection;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        console.log('⚠️ Server will continue without database (using fallback storage)');
        return null;
    }
}

// Graceful shutdown
async function disconnectDatabase() {
    try {
        await mongoose.connection.close();
        console.log('📊 MongoDB connection closed');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
}

module.exports = {
    connectDatabase,
    disconnectDatabase,
    mongoose
};
