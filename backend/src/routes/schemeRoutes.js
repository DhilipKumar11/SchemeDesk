import express from 'express';
import {
    getAllSchemes,
    getEligibleSchemes,
    getSchemeById,
    getSchemesByCategory
} from '../controllers/schemeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllSchemes);
router.get('/eligible', protect, getEligibleSchemes);
router.get('/category/:category', getSchemesByCategory);
router.get('/:id', getSchemeById);

export default router;
