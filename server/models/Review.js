const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    cleanlinessRating: { type: Number, required: true, min: 1, max: 5 },
    foodRating: { type: Number, required: true, min: 1, max: 5 },
    safetyRating: { type: Number, required: true, min: 1, max: 5 },
    wifiRating: { type: Number, required: true, min: 1, max: 5 },
    locationRating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    comment: { type: String, required: true, trim: true },
    photos: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reported: { type: Boolean, default: false },
    reportReason: { type: String, default: '' },
    verifiedStay: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
