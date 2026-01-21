import Application from '../models/Application.js';
import User from '../models/User.js';
import Scheme from '../models/Scheme.js';
import RiskScoreService from '../services/riskScoreService.js';
import Document from '../models/Document.js';

// @desc    Create new application
// @route   POST /api/applications
// @access  Private
export const createApplication = async (req, res) => {
    try {
        const { scheme_id } = req.body;
        const user_id = req.user.id;

        // Verify scheme exists
        const scheme = await Scheme.findById(scheme_id);
        if (!scheme) {
            return res.status(404).json({
                success: false,
                message: 'Scheme not found'
            });
        }

        // Calculate risk score (initially with no documents)
        const riskData = await RiskScoreService.calculateRiskScore(user_id, scheme_id, []);

        // Create application
        const application = await Application.create({
            user_id,
            scheme_id,
            risk_score: riskData.overallRisk
        });

        res.status(201).json({
            success: true,
            message: 'Application created successfully',
            data: {
                application,
                riskData
            }
        });
    } catch (error) {
        console.error('Create application error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating application',
            error: error.message
        });
    }
};

// @desc    Get user's applications
// @route   GET /api/applications
// @access  Private
export const getUserApplications = async (req, res) => {
    try {
        const applications = await Application.findByUserId(req.user.id);

        res.json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        console.error('Get user applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private
export const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Verify ownership
        if (application.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this application'
            });
        }

        // Get documents for this application
        const documents = await Document.findByApplicationId(application.id);

        res.json({
            success: true,
            data: {
                ...application,
                documents
            }
        });
    } catch (error) {
        console.error('Get application by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching application',
            error: error.message
        });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Admin in production)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const application = await Application.updateStatus(req.params.id, status);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.json({
            success: true,
            message: 'Application status updated',
            data: application
        });
    } catch (error) {
        console.error('Update application status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating application status',
            error: error.message
        });
    }
};

// @desc    Get application statistics
// @route   GET /api/applications/stats
// @access  Private
export const getApplicationStats = async (req, res) => {
    try {
        const stats = await Application.getStats(req.user.id);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Get application stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};

// @desc    Recalculate risk score
// @route   GET /api/applications/:id/risk
// @access  Private
export const recalculateRisk = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Verify ownership
        if (application.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Get documents
        const documents = await Document.findByApplicationId(application.id);

        // Recalculate risk
        const riskData = await RiskScoreService.calculateRiskScore(
            application.user_id,
            application.scheme_id,
            documents
        );

        res.json({
            success: true,
            data: riskData
        });
    } catch (error) {
        console.error('Recalculate risk error:', error);
        res.status(500).json({
            success: false,
            message: 'Error calculating risk score',
            error: error.message
        });
    }
};
