// Simple MongoDB Connection
const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
    if (isConnected) {
        console.log('📊 Using existing MongoDB connection');
        return;
    }

    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        
        if (!MONGODB_URI) {
            console.log('⚠️ No MONGODB_URI found. Running without database.');
            return null;
        }

        await mongoose.connect(MONGODB_URI);
        
        isConnected = true;
        console.log('✅ MongoDB connected successfully');
        console.log(`📊 Database: ${mongoose.connection.name}`);
        
        return mongoose.connection;
    } catch (error) {
        console.log('⚠️ MongoDB connection failed:', error.message);
        console.log('⚠️ Server will continue without database (using CSV fallback)');
        return null;
    }
}

async function disconnectDB() {
    if (!isConnected) return;
    
    try {
        await mongoose.disconnect();
        isConnected = false;
        console.log('📊 MongoDB disconnected');
    } catch (error) {
        console.error('Error disconnecting MongoDB:', error.message);
    }
}

module.exports = { connectDB, disconnectDB, mongoose };
