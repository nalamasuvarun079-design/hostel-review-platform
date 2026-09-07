require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Hostel = require('../models/Hostel');
const Review = require('../models/Review');
const Report = require('../models/Report');
const { initialHostels, initialUsers, initialReviews } = require('./mockDb');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hosteller_db';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing database collections...');
    await User.deleteMany({});
    await Hostel.deleteMany({});
    await Review.deleteMany({});
    await Report.deleteMany({});

    console.log('Seeding Users...');
    const createdUsers = await User.insertMany(
      initialUsers.map(({ _id, ...u }) => u)
    );

    console.log('Seeding Hostels...');
    const createdHostels = await Hostel.insertMany(
      initialHostels.map(({ _id, ...h }) => h)
    );

    console.log('Seeding Reviews...');
    const reviewData = initialReviews.map((rev) => {
      const user = createdUsers[0]._id; // assign first user for test
      const hostel = createdHostels[0]._id;
      const { _id, ...r } = rev;
      return {
        ...r,
        user,
        hostel,
      };
    });
    await Review.insertMany(reviewData);

    console.log('Database Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database Seed Failed:', error);
    process.exit(1);
  }
};

seedDB();
