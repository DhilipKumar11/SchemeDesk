import express from 'express';
import {
    getUserApplications,
    getApplicationById,
    createApplication,
    updateApplicationStatus,
    calculateRiskScore,
    getApplicationStats
} from '../controllers/trackerController.js';

const router = express.Router();

// Public routes - no authentication required for demo
router.get('/stats', getApplicationStats);
router.get('/', getUserApplications);
router.post('/', createApplication);
router.get('/:id', getApplicationById);
router.patch('/:id/status', updateApplicationStatus);
router.get('/:id/risk', calculateRiskScore);

export default router;
