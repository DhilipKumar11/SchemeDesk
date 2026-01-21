import rejectionPatterns from './rejectionPatterns.json' assert { type: 'json' };

/**
 * Risk Calculator - Core algorithm for risk score computation
 * Uses weighted factors based on historical rejection patterns
 */

export function calculateRisk(factors) {
    const patterns = rejectionPatterns.commonRejectionReasons;

    let totalRisk = 0;
    const breakdown = [];

    // Map factors to rejection patterns
    const factorMapping = {
        documentCompleteness: 'Incomplete documentation',
        documentValidity: 'Document validation failures',
        profileCompleteness: 'Incomplete profile'
    };

    for (const [factorKey, factorValue] of Object.entries(factors)) {
        const patternName = factorMapping[factorKey];
        const pattern = patterns.find(p => p.reason === patternName);

        if (pattern) {
            const weightedRisk = factorValue * pattern.weight;
            totalRisk += weightedRisk;

            breakdown.push({
                factor: factorKey,
                value: factorValue,
                weight: pattern.weight,
                contribution: weightedRisk,
                indicators: pattern.indicators
            });
        }
    }

    return {
        totalRisk: Math.round(totalRisk),
        breakdown,
        riskLevel: getRiskLevel(totalRisk)
    };
}

function getRiskLevel(score) {
    const { riskFactors } = rejectionPatterns;

    if (score >= riskFactors.critical.threshold) {
        return {
            level: 'CRITICAL',
            ...riskFactors.critical
        };
    }

    if (score >= riskFactors.medium.threshold) {
        return {
            level: 'MEDIUM',
            ...riskFactors.medium
        };
    }

    return {
        level: 'LOW',
        ...riskFactors.low
    };
}

export default { calculateRisk };
