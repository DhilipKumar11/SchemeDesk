import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    application_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['aadhaar', 'pan', 'income_certificate', 'address_proof', 'bank_statement', 'caste_certificate', 'age_proof', 'passport', 'driving_license', 'voter_id']
    },
    file_path: {
        type: String,
        required: true
    },
    expiry_date: {
        type: Date
    },
    validation_status: {
        type: String,
        enum: ['pending', 'valid', 'invalid', 'warning'],
        default: 'pending'
    },
    validation_errors: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Static methods for compatibility
documentSchema.statics.create = async function (documentData) {
    const doc = new this(documentData);
    await doc.save();
    return doc.toObject();
};

documentSchema.statics.findByApplicationId = async function (applicationId) {
    return await this.find({ application_id: applicationId }).sort({ createdAt: 1 });
};

documentSchema.statics.updateValidation = async function (id, validationStatus, validationErrors) {
    return await this.findByIdAndUpdate(
        id,
        { validation_status: validationStatus, validation_errors: validationErrors },
        { new: true }
    );
};

documentSchema.statics.findById = async function (id) {
    return await this.findOne({ _id: id });
};

const Document = mongoose.model('Document', documentSchema);

export default Document;
