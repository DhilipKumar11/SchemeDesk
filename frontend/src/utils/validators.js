export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password) => {
    // At least 6 characters
    return password.length >= 6;
};

export const validateRequired = (value) => {
    return value && value.toString().trim().length > 0;
};

export const validateAge = (age) => {
    const numAge = parseInt(age);
    return numAge >= 0 && numAge <= 120;
};

export const validateIncome = (income) => {
    const numIncome = parseFloat(income);
    return numIncome >= 0;
};

export const validatePhone = (phone) => {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone);
};
