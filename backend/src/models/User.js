import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    age: {
        type: Number,
        min: 0,
        max: 120
    },
    income: {
        type: Number,
        min: 0
    },
    state: {
        type: String,
        trim: true
    },
    district: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    category: {
        type: String,
        enum: ['General', 'OBC', 'SC', 'ST', 'EWS']
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Static methods for compatibility with old code
userSchema.statics.create = async function (userData) {
    const user = new this(userData);
    await user.save();
    return user.toObject();
};

userSchema.statics.findByEmail = async function (email) {
    return await this.findOne({ email }).select('+password');
};

userSchema.statics.findById = async function (id) {
    return await this.findOne({ _id: id });
};

userSchema.statics.update = async function (id, userData) {
    return await this.findByIdAndUpdate(id, userData, { new: true });
};

userSchema.statics.comparePassword = async function (plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

const User = mongoose.model('User', userSchema);

export default User;
