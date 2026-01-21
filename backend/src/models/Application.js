import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheme_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme',
    required: true
  },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'approved', 'rejected'],
    default: 'submitted'
  },
  risk_score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  applied_date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Static methods for compatibility
applicationSchema.statics.create = async function (applicationData) {
  const app = new this({
    ...applicationData,
    applied_date: new Date()
  });
  await app.save();
  return app.toObject();
};

applicationSchema.statics.findById = async function (id) {
  return await this.findOne({ _id: id })
    .populate('scheme_id', 'name category')
    .populate('user_id', 'name')
    .lean()
    .then(app => {
      if (app) {
        return {
          ...app,
          id: app._id,
          scheme_name: app.scheme_id?.name,
          category: app.scheme_id?.category,
          user_name: app.user_id?.name
        };
      }
      return null;
    });
};

applicationSchema.statics.findByUserId = async function (userId) {
  return await this.find({ user_id: userId })
    .populate('scheme_id', 'name category')
    .sort({ applied_date: -1 })
    .lean()
    .then(apps => apps.map(app => ({
      ...app,
      id: app._id,
      scheme_name: app.scheme_id?.name,
      category: app.scheme_id?.category
    })));
};

applicationSchema.statics.updateStatus = async function (id, status) {
  return await this.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
};

applicationSchema.statics.getStats = async function (userId) {
  const apps = await this.find({ user_id: userId });

  return {
    total: apps.length,
    submitted: apps.filter(a => a.status === 'submitted').length,
    under_review: apps.filter(a => a.status === 'under_review').length,
    approved: apps.filter(a => a.status === 'approved').length,
    rejected: apps.filter(a => a.status === 'rejected').length
  };
};

const Application = mongoose.model('Application', applicationSchema);

export default Application;
