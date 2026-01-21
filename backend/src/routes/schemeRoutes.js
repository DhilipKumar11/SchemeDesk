import express from 'express';
import { getAllSchemes, getSchemeById, getEligibleSchemes } from '../controllers/schemeController.js';

const router = express.Router();

// Public routes - no authentication required for demo
router.get('/', getAllSchemes);
router.get('/eligible', getEligibleSchemes);
router.get('/:id', getSchemeById);

export default router;
