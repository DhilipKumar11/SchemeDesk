import Scheme from '../models/Scheme.js';

class EligibilityService {
    /**
     * CORE DIFFERENTIATOR #1: Rule-based Eligibility Engine
     * Matches user profile against scheme eligibility criteria
     */
    static async getEligibleSchemes(userProfile) {
        const { age, income, state, district } = userProfile;

        // Get all schemes
        const allSchemes = await Scheme.getAll();

        // Filter and score schemes
        const eligibleSchemes = [];

        for (const scheme of allSchemes) {
            const rules = typeof scheme.eligibility_rules === 'string'
                ? JSON.parse(scheme.eligibility_rules)
                : scheme.eligibility_rules;

            const matchResult = this.evaluateEligibility(userProfile, rules);

            if (matchResult.isEligible) {
                eligibleSchemes.push({
                    ...scheme,
                    matchPercentage: matchResult.matchPercentage,
                    matchedCriteria: matchResult.matchedCriteria,
                    unmatchedCriteria: matchResult.unmatchedCriteria
                });
            }
        }

        // Sort by match percentage
        return eligibleSchemes.sort((a, b) => b.matchPercentage - a.matchPercentage);
    }

    static evaluateEligibility(userProfile, rules) {
        const { age, income, state, district } = userProfile;

        let totalCriteria = 0;
        let matchedCount = 0;
        const matchedCriteria = [];
        const unmatchedCriteria = [];

        // Age check
        if (rules.age) {
            totalCriteria++;
            const { min, max } = rules.age;
            if (age >= min && age <= max) {
                matchedCount++;
                matchedCriteria.push(`Age: ${min}-${max} years`);
            } else {
                unmatchedCriteria.push(`Age: ${min}-${max} years (You: ${age})`);
            }
        }

        // Income check
        if (rules.income) {
            totalCriteria++;
            const { min, max } = rules.income;
            if (income >= min && income <= max) {
                matchedCount++;
                matchedCriteria.push(`Income: ₹${min.toLocaleString()}-₹${max.toLocaleString()}`);
            } else {
                unmatchedCriteria.push(`Income: ₹${min.toLocaleString()}-₹${max.toLocaleString()} (You: ₹${income.toLocaleString()})`);
            }
        }

        // State check
        if (rules.states && rules.states.length > 0) {
            totalCriteria++;
            if (rules.states.includes(state) || rules.states.includes('All')) {
                matchedCount++;
                matchedCriteria.push(`State: ${state}`);
            } else {
                unmatchedCriteria.push(`State: ${rules.states.join(', ')} (You: ${state})`);
            }
        }

        // Gender check (if applicable)
        if (rules.gender && userProfile.gender) {
            totalCriteria++;
            if (rules.gender === userProfile.gender || rules.gender === 'All') {
                matchedCount++;
                matchedCriteria.push(`Gender: ${rules.gender}`);
            } else {
                unmatchedCriteria.push(`Gender: ${rules.gender} (You: ${userProfile.gender})`);
            }
        }

        // Category check (if applicable)
        if (rules.category && userProfile.category) {
            totalCriteria++;
            if (rules.category.includes(userProfile.category) || rules.category.includes('All')) {
                matchedCount++;
                matchedCriteria.push(`Category: ${userProfile.category}`);
            } else {
                unmatchedCriteria.push(`Category: ${rules.category.join(', ')} (You: ${userProfile.category})`);
            }
        }

        const matchPercentage = totalCriteria > 0 ? Math.round((matchedCount / totalCriteria) * 100) : 0;

        // Consider eligible if at least 70% criteria match
        const isEligible = matchPercentage >= 70;

        return {
            isEligible,
            matchPercentage,
            matchedCriteria,
            unmatchedCriteria,
            totalCriteria,
            matchedCount
        };
    }
}

export default EligibilityService;
