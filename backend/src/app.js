import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import trackerRoutes from './routes/trackerRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'SchemeDesk API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/applications', trackerRoutes);

// Welcome route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to SchemeDesk API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            schemes: '/api/schemes',
            documents: '/api/documents',
            applications: '/api/applications'
        }
    });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
