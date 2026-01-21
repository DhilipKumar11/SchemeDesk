import express from 'express';
import {
    createApplication,
    getUserApplications,
    getApplicationById,
    updateApplicationStatus,
    getApplicationStats,
    recalculateRisk
} from '../controllers/trackerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createApplication);
router.get('/', protect, getUserApplications);
router.get('/stats', protect, getApplicationStats);
router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, updateApplicationStatus);
router.get('/:id/risk', protect, recalculateRisk);

export default router;
