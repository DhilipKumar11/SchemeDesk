import Document from '../models/Document.js';
import User from '../models/User.js';

class RiskScoreService {
    /**
     * CORE DIFFERENTIATOR #2: Risk Score Generation
     * Calculates probability of application rejection (0-100)
     * Lower score = lower risk = better chance of approval
     */
    static async calculateRiskScore(userId, schemeId, documents = []) {
        const user = await User.findById(userId);

        const scores = {
            profileCompleteness: this.calculateProfileCompleteness(user),
            documentCompleteness: this.calculateDocumentCompleteness(documents),
            documentValidity: this.calculateDocumentValidity(documents),
            incomeVerification: this.calculateIncomeRisk(user.income),
            ageVerification: this.calculateAgeRisk(user.age)
        };

        // Weighted average
        const weights = {
            profileCompleteness: 0.15,
            documentCompleteness: 0.30,
            documentValidity: 0.35,
            incomeVerification: 0.10,
            ageVerification: 0.10
        };

        let totalRisk = 0;
        const breakdown = [];

        for (const [key, score] of Object.entries(scores)) {
            const weightedScore = score * weights[key];
            totalRisk += weightedScore;

            breakdown.push({
                factor: this.formatFactorName(key),
                score: score,
                weight: weights[key] * 100,
                impact: weightedScore,
                status: this.getRiskStatus(score)
            });
        }

        const overallRisk = Math.round(totalRisk);

        return {
            overallRisk,
            riskLevel: this.getRiskLevel(overallRisk),
            breakdown,
            recommendations: this.getRecommendations(scores, documents)
        };
    }

    static calculateProfileCompleteness(user) {
        const requiredFields = ['name', 'email', 'age', 'income', 'state', 'district'];
        const filledFields = requiredFields.filter(field => user[field] && user[field] !== '');

        const completeness = (filledFields.length / requiredFields.length) * 100;

        // Return risk score (inverse of completeness)
        return 100 - completeness;
    }

    static calculateDocumentCompleteness(documents) {
        if (!documents || documents.length === 0) {
            return 100; // Maximum risk if no documents
        }

        // Assume 5 documents are typically required
        const requiredDocCount = 5;
        const completeness = Math.min((documents.length / requiredDocCount) * 100, 100);

        return 100 - completeness;
    }

    static calculateDocumentValidity(documents) {
        if (!documents || documents.length === 0) {
            return 100;
        }

        const validDocs = documents.filter(doc => doc.validation_status === 'valid');
        const validityRate = (validDocs.length / documents.length) * 100;

        return 100 - validityRate;
    }

    static calculateIncomeRisk(income) {
        // Lower income = higher risk of rejection for some schemes
        // This is a simplified model
        if (income < 50000) return 70;
        if (income < 100000) return 50;
        if (income < 200000) return 30;
        if (income < 500000) return 20;
        return 10;
    }

    static calculateAgeRisk(age) {
        // Age extremes might have higher risk
        if (age < 18 || age > 70) return 60;
        if (age < 25 || age > 60) return 30;
        return 10;
    }

    static getRiskLevel(score) {
        if (score >= 70) return 'HIGH';
        if (score >= 40) return 'MEDIUM';
        return 'LOW';
    }

    static getRiskStatus(score) {
        if (score >= 70) return 'critical';
        if (score >= 40) return 'warning';
        return 'good';
    }

    static formatFactorName(key) {
        const names = {
            profileCompleteness: 'Profile Completeness',
            documentCompleteness: 'Document Completeness',
            documentValidity: 'Document Validity',
            incomeVerification: 'Income Verification',
            ageVerification: 'Age Verification'
        };
        return names[key] || key;
    }

    static getRecommendations(scores, documents) {
        const recommendations = [];

        if (scores.profileCompleteness > 20) {
            recommendations.push({
                priority: 'high',
                message: 'Complete all profile fields to reduce rejection risk',
                action: 'Update your profile with missing information'
            });
        }

        if (scores.documentCompleteness > 40) {
            recommendations.push({
                priority: 'high',
                message: 'Upload all required documents',
                action: 'Add missing documents to strengthen your application'
            });
        }

        if (scores.documentValidity > 30) {
            recommendations.push({
                priority: 'critical',
                message: 'Fix document validation errors',
                action: 'Review and re-upload documents with issues'
            });
        }

        if (documents && documents.length > 0) {
            const expiringSoon = documents.filter(doc => {
                if (!doc.expiry_date) return false;
                const expiryDate = new Date(doc.expiry_date);
                const daysUntilExpiry = (expiryDate - new Date()) / (1000 * 60 * 60 * 24);
                return daysUntilExpiry < 30 && daysUntilExpiry > 0;
            });

            if (expiringSoon.length > 0) {
                recommendations.push({
                    priority: 'medium',
                    message: `${expiringSoon.length} document(s) expiring soon`,
                    action: 'Renew documents before they expire'
                });
            }
        }

        if (recommendations.length === 0) {
            recommendations.push({
                priority: 'low',
                message: 'Your application looks strong!',
                action: 'Proceed with confidence'
            });
        }

        return recommendations;
    }
}

export default RiskScoreService;
