const mongoose = require('mongoose');

const RoomTypeSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g. Single, Double Sharing, Triple Sharing
  rent: { type: Number, required: true },
  available: { type: Boolean, default: true },
  description: { type: String, default: '' },
});

const HostelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, lowercase: true, trim: true },
    description: { type: String, required: true },
    genderType: { type: String, enum: ['Boys', 'Girls', 'Co-ed'], required: true },
    address: { type: String, required: true },
    city: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    nearestCollege: { type: String, required: true },
    distanceFromCollege: { type: Number, required: true }, // in KM
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    monthlyRent: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    roomTypes: [RoomTypeSchema],
    facilities: [{ type: String }], // e.g. ["Wi-Fi", "AC", "Laundry", "CCTV", "Power Backup", "Gym", "Study Room", "Security"]
    foodDetails: {
      available: { type: Boolean, default: true },
      type: { type: String, default: 'Veg & Non-Veg' }, // Veg, Non-Veg, Both
      description: { type: String, default: '3 meals provided daily (Breakfast, Lunch, Dinner)' },
      includedInRent: { type: Boolean, default: true },
    },
    wifiDetails: {
      available: { type: Boolean, default: true },
      speedMbps: { type: Number, default: 100 },
    },
    acDetails: {
      acAvailable: { type: Boolean, default: true },
    },
    rules: [{ type: String }], // e.g. ["Curfew 10:00 PM", "No alcohol/smoking", "Visitors allowed till 8 PM"]
    contact: {
      ownerName: { type: String, default: 'Hostel Manager' },
      phone: { type: String, required: true },
      email: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
    },
    photos: [{ type: String }],
    ratings: {
      overall: { type: Number, default: 0 },
      cleanliness: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      safety: { type: Number, default: 0 },
      wifi: { type: Number, default: 0 },
      location: { type: Number, default: 0 },
    },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    verified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Hostel || mongoose.model('Hostel', HostelSchema);
