/**
 * Name Matching Algorithm
 * Uses fuzzy matching to compare names on documents with user profile
 */

export function nameMatch(userName, documentName) {
    // Normalize names
    const normalizedUserName = normalizeName(userName);
    const normalizedDocName = normalizeName(documentName);

    // Calculate similarity using Levenshtein distance
    const similarity = calculateSimilarity(normalizedUserName, normalizedDocName);

    // Consider a match if similarity >= 80%
    const isMatch = similarity >= 80;

    return {
        isMatch,
        similarity,
        userName: normalizedUserName,
        documentName: normalizedDocName
    };
}

function normalizeName(name) {
    if (!name) return '';

    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z\s]/g, '') // Remove special characters
        .replace(/\s+/g, ' '); // Normalize spaces
}

function calculateSimilarity(str1, str2) {
    const distance = levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);

    if (maxLength === 0) return 100;

    const similarity = ((maxLength - distance) / maxLength) * 100;
    return Math.round(similarity);
}

function levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
}
