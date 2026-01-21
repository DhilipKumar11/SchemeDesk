import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Document from '../models/Document.js';
import User from '../models/User.js';
import DocumentCheckService from '../services/documentCheckService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only .pdf, .jpg, .jpeg, .png files are allowed'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
});

// @desc    Upload document
// @route   POST /api/documents/upload
// @access  Private
export const uploadDocument = [
    upload.single('document'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            const { application_id, type, expiry_date, extracted_name } = req.body;

            if (!application_id || !type) {
                return res.status(400).json({
                    success: false,
                    message: 'Application ID and document type are required'
                });
            }

            // Get user info for validation
            const user = await User.findById(req.user.id);

            // Validate document
            const validationResult = await DocumentCheckService.validateDocument({
                file: req.file,
                type,
                expiryDate: expiry_date,
                extractedName: extracted_name
            }, user.name);

            // Save document record
            const document = await Document.create({
                application_id,
                type,
                file_path: req.file.path,
                expiry_date: expiry_date || null,
                validation_status: validationResult.validationStatus,
                validation_errors: validationResult.validationErrors.length > 0
                    ? validationResult.validationErrors
                    : null
            });

            res.status(201).json({
                success: true,
                message: 'Document uploaded successfully',
                data: {
                    document,
                    validation: validationResult
                }
            });
        } catch (error) {
            console.error('Upload document error:', error);
            res.status(500).json({
                success: false,
                message: 'Error uploading document',
                error: error.message
            });
        }
    }
];

// @desc    Get documents for application
// @route   GET /api/documents/application/:applicationId
// @access  Private
export const getDocumentsByApplication = async (req, res) => {
    try {
        const documents = await Document.findByApplicationId(req.params.applicationId);

        res.json({
            success: true,
            count: documents.length,
            data: documents
        });
    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching documents',
            error: error.message
        });
    }
};

// @desc    Validate document
// @route   POST /api/documents/:id/validate
// @access  Private
export const validateDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        const user = await User.findById(req.user.id);

        const validationResult = await DocumentCheckService.validateDocument({
            file: { path: document.file_path, originalname: path.basename(document.file_path), size: 1024 },
            type: document.type,
            expiryDate: document.expiry_date,
            extractedName: req.body.extracted_name
        }, user.name);

        // Update document validation status
        await Document.updateValidation(
            document.id,
            validationResult.validationStatus,
            validationResult.validationErrors
        );

        res.json({
            success: true,
            message: 'Document validated',
            data: validationResult
        });
    } catch (error) {
        console.error('Validate document error:', error);
        res.status(500).json({
            success: false,
            message: 'Error validating document',
            error: error.message
        });
    }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req, res) => {
    try {
        // In production, implement actual deletion logic
        res.json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting document',
            error: error.message
        });
    }
};
