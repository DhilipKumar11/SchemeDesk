/**
 * File Format and Size Validation
 * Checks if uploaded files meet requirements
 */

const ALLOWED_FORMATS = ['pdf', 'jpg', 'jpeg', 'png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_FILE_SIZE = 10 * 1024; // 10KB

export function formatCheck(file) {
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

    // Check file extension
    const fileName = file.originalname || file.name || '';
    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (!ALLOWED_FORMATS.includes(fileExtension)) {
        errors.push({
            type: 'invalid_format',
            message: `File format .${fileExtension} not allowed. Allowed formats: ${ALLOWED_FORMATS.join(', ')}`,
            severity: 'high'
        });
    }

    // Check file size
    const fileSize = file.size;

    if (fileSize > MAX_FILE_SIZE) {
        errors.push({
            type: 'file_too_large',
            message: `File size ${formatBytes(fileSize)} exceeds maximum ${formatBytes(MAX_FILE_SIZE)}`,
            severity: 'high'
        });
    }

    if (fileSize < MIN_FILE_SIZE) {
        warnings.push({
            type: 'file_too_small',
            message: `File size ${formatBytes(fileSize)} is unusually small. Please verify the file is complete.`,
            severity: 'medium'
        });
    }

    // Check file name
    if (fileName.length > 100) {
        warnings.push({
            type: 'long_filename',
            message: 'File name is very long. Consider renaming for better compatibility.',
            severity: 'low'
        });
    }

    // Check for special characters in filename
    const hasSpecialChars = /[^a-zA-Z0-9._-]/.test(fileName);
    if (hasSpecialChars) {
        warnings.push({
            type: 'special_characters',
            message: 'File name contains special characters. This may cause issues.',
            severity: 'low'
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        fileInfo: {
            name: fileName,
            extension: fileExtension,
            size: fileSize,
            sizeFormatted: formatBytes(fileSize)
        }
    };
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
