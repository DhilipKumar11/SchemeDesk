/**
 * Expiry Date Validation
 * Checks if documents are expired or expiring soon
 */

export function expiryCheck(expiryDate) {
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

    // Set time to midnight for accurate day calculation
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
