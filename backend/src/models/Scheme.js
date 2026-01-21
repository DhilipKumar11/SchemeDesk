import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Agriculture', 'Health', 'Education', 'Housing', 'Business', 'Pension', 'Women Empowerment', 'Social Welfare']
    },
    description: {
        type: String,
        required: true
    },
    eligibility_rules: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    documents_required: {
        type: [String],
        required: true
    },
    benefits: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Static methods for compatibility
schemeSchema.statics.getAll = async function () {
    return await this.find().sort({ name: 1 });
};

schemeSchema.statics.findById = async function (id) {
    return await this.findOne({ _id: id });
};

schemeSchema.statics.findByCategory = async function (category) {
    return await this.find({ category }).sort({ name: 1 });
};

const Scheme = mongoose.model('Scheme', schemeSchema);

export default Scheme;
