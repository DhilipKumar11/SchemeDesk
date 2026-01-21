import app from './src/app.js';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory');
}

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start server
        app.listen(PORT, () => {
            console.log('');
            console.log('🚀 ========================================');
            console.log(`🚀 SchemeDesk Backend Server`);
            console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🚀 API URL: http://localhost:${PORT}`);
            console.log('🚀 ========================================');
            console.log('');
            console.log('📋 Available endpoints:');
            console.log(`   - Health: http://localhost:${PORT}/health`);
            console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
            console.log(`   - Schemes: http://localhost:${PORT}/api/schemes`);
            console.log(`   - Documents: http://localhost:${PORT}/api/documents`);
            console.log(`   - Applications: http://localhost:${PORT}/api/applications`);
            console.log('');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    process.exit(1);
});

// Start the server
startServer();
