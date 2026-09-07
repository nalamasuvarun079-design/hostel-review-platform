const Hostel = require('../models/Hostel');
const Review = require('../models/Review');
const { getIsConnected } = require('../config/db');
const { getStore } = require('../utils/mockDb');

// @desc Get all hostels with search, filters & pagination
// @route GET /api/hostels
const getHostels = async (req, res) => {
  try {
    const {
      search,
      location,
      college,
      gender,
      minPrice,
      maxPrice,
      minRating,
      food,
      wifi,
      ac,
      distance,
      sortBy,
    } = req.query;

    if (getIsConnected()) {
      let query = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { area: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { nearestCollege: { $regex: search, $options: 'i' } },
        ];
      }

      if (location) {
        query.$or = [
          { city: { $regex: location, $options: 'i' } },
          { area: { $regex: location, $options: 'i' } },
        ];
      }

      if (college) {
        query.nearestCollege = { $regex: college, $options: 'i' };
      }

      if (gender && gender !== 'All') {
        query.genderType = gender;
      }

      if (minPrice || maxPrice) {
        query['monthlyRent.min'] = { $gte: Number(minPrice) || 0 };
        if (maxPrice) query['monthlyRent.min'].$lte = Number(maxPrice);
      }

      if (minRating) {
        query['ratings.overall'] = { $gte: Number(minRating) };
      }

      if (food === 'true') {
        query['foodDetails.available'] = true;
      }

      if (wifi === 'true') {
        query['wifiDetails.available'] = true;
      }

      if (ac === 'true') {
        query['acDetails.acAvailable'] = true;
      }

      if (distance) {
        query.distanceFromCollege = { $lte: Number(distance) };
      }

      let sortOptions = { createdAt: -1 };
      if (sortBy === 'price_asc') sortOptions = { 'monthlyRent.min': 1 };
      if (sortBy === 'price_desc') sortOptions = { 'monthlyRent.min': -1 };
      if (sortBy === 'rating_desc') sortOptions = { 'ratings.overall': -1 };
      if (sortBy === 'reviews_desc') sortOptions = { reviewCount: -1 };

      const hostels = await Hostel.find(query).sort(sortOptions);
      return res.json(hostels);
    } else {
      // In-Memory Filtering logic
      const store = getStore();
      let results = [...store.hostels];

      if (search) {
        const s = search.toLowerCase();
        results = results.filter(
          h =>
            h.name.toLowerCase().includes(s) ||
            h.area.toLowerCase().includes(s) ||
            h.city.toLowerCase().includes(s) ||
            h.nearestCollege.toLowerCase().includes(s)
        );
      }

      if (location) {
        const l = location.toLowerCase();
        results = results.filter(
          h => h.city.toLowerCase().includes(l) || h.area.toLowerCase().includes(l)
        );
      }

      if (college) {
        results = results.filter(h =>
          h.nearestCollege.toLowerCase().includes(college.toLowerCase())
        );
      }

      if (gender && gender !== 'All') {
        results = results.filter(h => h.genderType === gender);
      }

      if (minPrice) {
        results = results.filter(h => h.monthlyRent.min >= Number(minPrice));
      }

      if (maxPrice) {
        results = results.filter(h => h.monthlyRent.min <= Number(maxPrice));
      }

      if (minRating) {
        results = results.filter(h => h.ratings.overall >= Number(minRating));
      }

      if (food === 'true') {
        results = results.filter(h => h.foodDetails?.available === true);
      }

      if (wifi === 'true') {
        results = results.filter(h => h.wifiDetails?.available === true);
      }

      if (ac === 'true') {
        results = results.filter(h => h.acDetails?.acAvailable === true);
      }

      if (distance) {
        results = results.filter(h => h.distanceFromCollege <= Number(distance));
      }

      if (sortBy === 'price_asc') {
        results.sort((a, b) => a.monthlyRent.min - b.monthlyRent.min);
      } else if (sortBy === 'price_desc') {
        results.sort((a, b) => b.monthlyRent.min - a.monthlyRent.min);
      } else if (sortBy === 'rating_desc') {
        results.sort((a, b) => b.ratings.overall - a.ratings.overall);
      } else if (sortBy === 'reviews_desc') {
        results.sort((a, b) => b.reviewCount - a.reviewCount);
      } else {
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      return res.json(results);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single hostel by ID or slug
// @route GET /api/hostels/:id
const getHostelById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const hostel = await Hostel.findById(id);
      if (!hostel) return res.status(404).json({ message: 'Hostel not found' });
      return res.json(hostel);
    } else {
      const store = getStore();
      const hostel = store.hostels.find(h => h._id === id || h.slug === id);
      if (!hostel) return res.status(404).json({ message: 'Hostel not found' });
      return res.json(hostel);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create new hostel (Admin)
// @route POST /api/hostels
const createHostel = async (req, res) => {
  try {
    const hostelData = req.body;
    if (!hostelData.name || !hostelData.address || !hostelData.city || !hostelData.nearestCollege) {
      return res.status(400).json({ message: 'Please provide all required hostel details' });
    }

    if (getIsConnected()) {
      const newHostel = await Hostel.create(hostelData);
      return res.status(201).json(newHostel);
    } else {
      const store = getStore();
      const newHostel = {
        _id: 'h_' + Date.now(),
        slug: hostelData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        ratings: { overall: 0, cleanliness: 0, food: 0, safety: 0, wifi: 0, location: 0 },
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        verified: true,
        photos: hostelData.photos && hostelData.photos.length ? hostelData.photos : [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'
        ],
        ...hostelData,
      };
      store.hostels.unshift(newHostel);
      return res.status(201).json(newHostel);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update hostel (Admin)
// @route PUT /api/hostels/:id
const updateHostel = async (req, res) => {
  try {
    const { id } = req.params;
    const hostelData = req.body;

    if (getIsConnected()) {
      const updated = await Hostel.findByIdAndUpdate(id, hostelData, { new: true });
      if (!updated) return res.status(404).json({ message: 'Hostel not found' });
      return res.json(updated);
    } else {
      const store = getStore();
      const index = store.hostels.findIndex(h => h._id === id);
      if (index === -1) return res.status(404).json({ message: 'Hostel not found' });
      store.hostels[index] = { ...store.hostels[index], ...hostelData };
      return res.json(store.hostels[index]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete hostel (Admin)
// @route DELETE /api/hostels/:id
const deleteHostel = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      await Hostel.findByIdAndDelete(id);
      await Review.deleteMany({ hostel: id });
      return res.json({ message: 'Hostel and associated reviews deleted successfully' });
    } else {
      const store = getStore();
      store.hostels = store.hostels.filter(h => h._id !== id);
      store.reviews = store.reviews.filter(r => (r.hostel._id || r.hostel) !== id);
      return res.json({ message: 'Hostel and associated reviews deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel,
};
