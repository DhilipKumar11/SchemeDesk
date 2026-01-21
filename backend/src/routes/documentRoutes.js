import express from 'express';
import {
    uploadDocument,
    getDocumentsByApplication,
    validateDocument,
    deleteDocument
} from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/upload', protect, uploadDocument);
router.get('/application/:applicationId', protect, getDocumentsByApplication);
router.post('/:id/validate', protect, validateDocument);
router.delete('/:id', protect, deleteDocument);

export default router;
