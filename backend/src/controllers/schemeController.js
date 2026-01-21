import Scheme from '../models/Scheme.js';
import User from '../models/User.js';
import EligibilityService from '../services/eligibilityService.js';

// @desc    Get all schemes
// @route   GET /api/schemes
// @access  Public
export const getAllSchemes = async (req, res) => {
    try {
        const schemes = await Scheme.getAll();

        res.json({
            success: true,
            count: schemes.length,
            data: schemes
        });
    } catch (error) {
        console.error('Get all schemes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching schemes',
            error: error.message
        });
    }
};

// @desc    Get eligible schemes for current user
// @route   GET /api/schemes/eligible
// @access  Private
export const getEligibleSchemes = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const eligibleSchemes = await EligibilityService.getEligibleSchemes(user);

        res.json({
            success: true,
            count: eligibleSchemes.length,
            data: eligibleSchemes,
            userProfile: {
                age: user.age,
                income: user.income,
                state: user.state,
                district: user.district
            }
        });
    } catch (error) {
        console.error('Get eligible schemes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error calculating eligible schemes',
            error: error.message
        });
    }
};

// @desc    Get scheme by ID
// @route   GET /api/schemes/:id
// @access  Public
export const getSchemeById = async (req, res) => {
    try {
        const scheme = await Scheme.findById(req.params.id);

        if (!scheme) {
            return res.status(404).json({
                success: false,
                message: 'Scheme not found'
            });
        }

        res.json({
            success: true,
            data: scheme
        });
    } catch (error) {
        console.error('Get scheme by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching scheme',
            error: error.message
        });
    }
};

// @desc    Get schemes by category
// @route   GET /api/schemes/category/:category
// @access  Public
export const getSchemesByCategory = async (req, res) => {
    try {
        const schemes = await Scheme.findByCategory(req.params.category);

        res.json({
            success: true,
            count: schemes.length,
            category: req.params.category,
            data: schemes
        });
    } catch (error) {
        console.error('Get schemes by category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching schemes',
            error: error.message
        });
    }
};
