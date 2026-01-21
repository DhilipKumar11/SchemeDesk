import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import AI engine modules using absolute paths
const aiEnginePath = path.join(__dirname, '../../../ai-engine');
import(`${aiEnginePath}/document-analyzer/nameMatch.js`).catch(() => null);
import(`${aiEnginePath}/document-analyzer/expiryCheck.js`).catch(() => null);
import(`${aiEnginePath}/document-analyzer/formatCheck.js`).catch(() => null);

// Inline the AI engine functions to avoid import issues
function nameMatch(userName, documentName) {
  const normalizeName = (name) => {
    if (!name) return '';
    return name.toLowerCase().trim().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ');
  };
  
  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) matrix[i] = [i];
    for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };
  
  const normalizedUserName = normalizeName(userName);
  const normalizedDocName = normalizeName(documentName);
  const distance = levenshteinDistance(normalizedUserName, normalizedDocName);
  const maxLength = Math.max(normalizedUserName.length, normalizedDocName.length);
  const similarity = maxLength === 0 ? 100 : Math.round(((maxLength - distance) / maxLength) * 100);
  
  return {
    isMatch: similarity >= 80,
    similarity,
    userName: normalizedUserName,
    documentName: normalizedDocName
  };
}

function expiryCheck(expiryDate) {
  if (!expiryDate) {
    return {
      isExpired: false,
      expiringSoon: false,
      daysUntilExpiry: null,
      message: 'No expiry date provided'
    };
  }
  
  const expiry = new Date(expiryDate);
  const today = new Date();
  expiry.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  const isExpired = daysUntilExpiry < 0;
  const expiringSoon = daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
  
  let message = '';
  if (isExpired) {
    message = `Document expired ${Math.abs(daysUntilExpiry)} days ago`;
  } else if (expiringSoon) {
    message = `Document expires in ${daysUntilExpiry} days`;
  } else {
    message = `Document valid for ${daysUntilExpiry} days`;
  }
  
  return {
    isExpired,
    expiringSoon,
    daysUntilExpiry,
    expiryDate: expiry.toISOString().split('T')[0],
    message,
    status: isExpired ? 'expired' : (expiringSoon ? 'expiring_soon' : 'valid')
  };
}

function formatCheck(file) {
  const ALLOWED_FORMATS = ['pdf', 'jpg', 'jpeg', 'png'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const MIN_FILE_SIZE = 10 * 1024;
  
  const errors = [];
  const warnings = [];
  
  if (!file) {
    errors.push({
      type: 'missing_file',
      message: 'No file provided',
      severity: 'critical'
    });
    return { isValid: false, errors, warnings };
  }
  
  const fileName = file.originalname || file.name || '';
  const fileExtension = fileName.split('.').pop().toLowerCase();
  
  if (!ALLOWED_FORMATS.includes(fileExtension)) {
    errors.push({
      type: 'invalid_format',
      message: `File format .${fileExtension} not allowed. Allowed formats: ${ALLOWED_FORMATS.join(', ')}`,
      severity: 'high'
    });
  }
  
  const fileSize = file.size;
  if (fileSize > MAX_FILE_SIZE) {
    errors.push({
      type: 'file_too_large',
      message: `File size exceeds maximum 5MB`,
      severity: 'high'
    });
  }
  
  if (fileSize < MIN_FILE_SIZE) {
    warnings.push({
      type: 'file_too_small',
      message: `File size is unusually small. Please verify the file is complete.`,
      severity: 'medium'
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    fileInfo: {
      name: fileName,
      extension: fileExtension,
      size: fileSize
    }
  };
}


class DocumentCheckService {
    /**
     * CORE DIFFERENTIATOR #3: Document Validation
     * Automated sanity checks for uploaded documents
     */
    static async validateDocument(documentData, userName) {
        const validationErrors = [];
        const warnings = [];

        // 1. Format Check
        const formatResult = formatCheck(documentData.file);
        if (!formatResult.isValid) {
            validationErrors.push(...formatResult.errors);
        }
        if (formatResult.warnings) {
            warnings.push(...formatResult.warnings);
        }

        // 2. Name Match Check (if document has extractable name)
        if (documentData.extractedName) {
            const nameResult = nameMatch(userName, documentData.extractedName);
            if (!nameResult.isMatch) {
                validationErrors.push({
                    type: 'name_mismatch',
                    message: `Name on document "${documentData.extractedName}" doesn't match profile name "${userName}"`,
                    severity: 'high',
                    matchScore: nameResult.similarity
                });
            } else if (nameResult.similarity < 90) {
                warnings.push({
                    type: 'name_partial_match',
                    message: `Name similarity is ${nameResult.similarity}%. Please verify the name matches exactly.`,
                    severity: 'medium'
                });
            }
        }

        // 3. Expiry Check
        if (documentData.expiryDate) {
            const expiryResult = expiryCheck(documentData.expiryDate);
            if (expiryResult.isExpired) {
                validationErrors.push({
                    type: 'expired_document',
                    message: `Document expired on ${new Date(documentData.expiryDate).toLocaleDateString()}`,
                    severity: 'critical'
                });
            } else if (expiryResult.expiringSoon) {
                warnings.push({
                    type: 'expiring_soon',
                    message: `Document expires in ${expiryResult.daysUntilExpiry} days`,
                    severity: 'medium'
                });
            }
        }

        // 4. Document Type Check
        const requiredTypes = ['aadhaar', 'pan', 'income_certificate', 'address_proof', 'bank_statement'];
        if (!requiredTypes.includes(documentData.type)) {
            warnings.push({
                type: 'unknown_document_type',
                message: `Document type "${documentData.type}" is not in the standard list`,
                severity: 'low'
            });
        }

        // Determine overall validation status
        let validationStatus = 'valid';
        if (validationErrors.length > 0) {
            validationStatus = 'invalid';
        } else if (warnings.length > 0) {
            validationStatus = 'warning';
        }

        return {
            validationStatus,
            validationErrors,
            warnings,
            isValid: validationErrors.length === 0,
            summary: this.generateSummary(validationStatus, validationErrors, warnings)
        };
    }

    static generateSummary(status, errors, warnings) {
        if (status === 'valid' && warnings.length === 0) {
            return '✅ Document validated successfully';
        }

        if (status === 'invalid') {
            return `❌ ${errors.length} validation error(s) found. Please fix and re-upload.`;
        }

        if (status === 'warning') {
            return `⚠️ ${warnings.length} warning(s) found. Review recommended.`;
        }

        return 'Document validation completed';
    }

    static async validateBatch(documents, userName) {
        const results = [];

        for (const doc of documents) {
            const result = await this.validateDocument(doc, userName);
            results.push({
                documentId: doc.id,
                documentType: doc.type,
                ...result
            });
        }

        const allValid = results.every(r => r.isValid);
        const criticalIssues = results.filter(r =>
            r.validationErrors.some(e => e.severity === 'critical')
        ).length;

        return {
            results,
            allValid,
            totalDocuments: documents.length,
            validDocuments: results.filter(r => r.isValid).length,
            criticalIssues,
            overallStatus: allValid ? 'all_valid' : (criticalIssues > 0 ? 'critical_issues' : 'minor_issues')
        };
    }
}

export default DocumentCheckService;
