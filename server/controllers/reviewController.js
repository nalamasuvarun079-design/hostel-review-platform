const Review = require('../models/Review');
const Hostel = require('../models/Hostel');
const Report = require('../models/Report');
const { getIsConnected } = require('../config/db');
const { getStore, updateHostelRatings } = require('../utils/mockDb');

// Recalculate hostel average ratings for Mongoose DB
const recalculateHostelRatingMongoose = async (hostelId) => {
  const reviews = await Review.find({ hostel: hostelId });
  if (reviews.length === 0) {
    await Hostel.findByIdAndUpdate(hostelId, {
      ratings: { overall: 0, cleanliness: 0, food: 0, safety: 0, wifi: 0, location: 0 },
      reviewCount: 0,
    });
    return;
  }

  const sum = reviews.reduce(
    (acc, r) => {
      acc.overall += r.rating;
      acc.cleanliness += r.cleanlinessRating;
      acc.food += r.foodRating;
      acc.safety += r.safetyRating;
      acc.wifi += r.wifiRating;
      acc.location += r.locationRating;
      return acc;
    },
    { overall: 0, cleanliness: 0, food: 0, safety: 0, wifi: 0, location: 0 }
  );

  const count = reviews.length;
  const newRatings = {
    overall: parseFloat((sum.overall / count).toFixed(1)),
    cleanliness: parseFloat((sum.cleanliness / count).toFixed(1)),
    food: parseFloat((sum.food / count).toFixed(1)),
    safety: parseFloat((sum.safety / count).toFixed(1)),
    wifi: parseFloat((sum.wifi / count).toFixed(1)),
    location: parseFloat((sum.location / count).toFixed(1)),
  };

  await Hostel.findByIdAndUpdate(hostelId, {
    ratings: newRatings,
    reviewCount: count,
  });
};

// @desc Get reviews for a hostel
// @route GET /api/reviews/hostel/:hostelId
const getHostelReviews = async (req, res) => {
  try {
    const { hostelId } = req.params;

    if (getIsConnected()) {
      const reviews = await Review.find({ hostel: hostelId })
        .populate('user', 'name avatar role college')
        .sort({ createdAt: -1 });
      return res.json(reviews);
    } else {
      const store = getStore();
      const reviews = store.reviews.filter(r => (r.hostel._id || r.hostel) === hostelId);
      return res.json(reviews);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create a new review
// @route POST /api/reviews
const createReview = async (req, res) => {
  try {
    const {
      hostelId,
      rating,
      cleanlinessRating,
      foodRating,
      safetyRating,
      wifiRating,
      locationRating,
      title,
      comment,
      photos,
    } = req.body;

    if (!hostelId || !rating || !title || !comment) {
      return res.status(400).json({ message: 'Please provide all required review fields' });
    }

    if (getIsConnected()) {
      // Check if user already reviewed this hostel
      const existing = await Review.findOne({ hostel: hostelId, user: req.user._id });
      if (existing) {
        return res.status(400).json({ message: 'You have already submitted a review for this hostel' });
      }

      const review = await Review.create({
        hostel: hostelId,
        user: req.user._id,
        rating: Number(rating),
        cleanlinessRating: Number(cleanlinessRating || rating),
        foodRating: Number(foodRating || rating),
        safetyRating: Number(safetyRating || rating),
        wifiRating: Number(wifiRating || rating),
        locationRating: Number(locationRating || rating),
        title,
        comment,
        photos: photos || [],
        verifiedStay: true,
      });

      await recalculateHostelRatingMongoose(hostelId);

      const populatedReview = await Review.findById(review._id).populate('user', 'name avatar role college');
      return res.status(201).json(populatedReview);
    } else {
      const store = getStore();
      const existing = store.reviews.find(
        r => (r.hostel._id || r.hostel) === hostelId && (r.user._id || r.user) === req.user._id
      );
      if (existing) {
        return res.status(400).json({ message: 'You have already submitted a review for this hostel' });
      }

      const newReview = {
        _id: 'r_' + Date.now(),
        hostel: hostelId,
        user: {
          _id: req.user._id,
          name: req.user.name,
          avatar: req.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          role: req.user.role,
          college: req.user.college || '',
        },
        rating: Number(rating),
        cleanlinessRating: Number(cleanlinessRating || rating),
        foodRating: Number(foodRating || rating),
        safetyRating: Number(safetyRating || rating),
        wifiRating: Number(wifiRating || rating),
        locationRating: Number(locationRating || rating),
        title,
        comment,
        photos: photos || [],
        likes: [],
        reported: false,
        verifiedStay: true,
        createdAt: new Date().toISOString(),
      };

      store.reviews.unshift(newReview);
      updateHostelRatings(hostelId);

      return res.status(201).json(newReview);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update review (Author only)
// @route PUT /api/reviews/:id
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, comment, rating, cleanlinessRating, foodRating, safetyRating, wifiRating, locationRating, photos } = req.body;

    if (getIsConnected()) {
      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ message: 'Review not found' });

      if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to edit this review' });
      }

      review.title = title || review.title;
      review.comment = comment || review.comment;
      if (rating) review.rating = Number(rating);
      if (cleanlinessRating) review.cleanlinessRating = Number(cleanlinessRating);
      if (foodRating) review.foodRating = Number(foodRating);
      if (safetyRating) review.safetyRating = Number(safetyRating);
      if (wifiRating) review.wifiRating = Number(wifiRating);
      if (locationRating) review.locationRating = Number(locationRating);
      if (photos) review.photos = photos;

      await review.save();
      await recalculateHostelRatingMongoose(review.hostel);

      const updated = await Review.findById(id).populate('user', 'name avatar role college');
      return res.json(updated);
    } else {
      const store = getStore();
      const review = store.reviews.find(r => r._id === id);
      if (!review) return res.status(404).json({ message: 'Review not found' });

      const reviewUserId = review.user._id || review.user;
      if (reviewUserId !== req.user._id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to edit this review' });
      }

      if (title) review.title = title;
      if (comment) review.comment = comment;
      if (rating) review.rating = Number(rating);
      if (cleanlinessRating) review.cleanlinessRating = Number(cleanlinessRating);
      if (foodRating) review.foodRating = Number(foodRating);
      if (safetyRating) review.safetyRating = Number(safetyRating);
      if (wifiRating) review.wifiRating = Number(wifiRating);
      if (locationRating) review.locationRating = Number(locationRating);
      if (photos) review.photos = photos;

      const hostelId = review.hostel._id || review.hostel;
      updateHostelRatings(hostelId);

      return res.json(review);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete review (Author or Admin)
// @route DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ message: 'Review not found' });

      if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this review' });
      }

      const hostelId = review.hostel;
      await Review.findByIdAndDelete(id);
      await Report.deleteMany({ review: id });
      await recalculateHostelRatingMongoose(hostelId);

      return res.json({ message: 'Review deleted successfully' });
    } else {
      const store = getStore();
      const index = store.reviews.findIndex(r => r._id === id);
      if (index === -1) return res.status(404).json({ message: 'Review not found' });

      const review = store.reviews[index];
      const reviewUserId = review.user._id || review.user;
      if (reviewUserId !== req.user._id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this review' });
      }

      const hostelId = review.hostel._id || review.hostel;
      store.reviews.splice(index, 1);
      store.reports = store.reports.filter(rep => rep.review !== id);
      updateHostelRatings(hostelId);

      return res.json({ message: 'Review deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle Like on Review
// @route POST /api/reviews/:id/like
const toggleLikeReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ message: 'Review not found' });

      const index = review.likes.indexOf(req.user._id);
      if (index > -1) {
        review.likes.splice(index, 1);
      } else {
        review.likes.push(req.user._id);
      }
      await review.save();
      return res.json({ likes: review.likes });
    } else {
      const store = getStore();
      const review = store.reviews.find(r => r._id === id);
      if (!review) return res.status(404).json({ message: 'Review not found' });
      if (!review.likes) review.likes = [];

      const idx = review.likes.indexOf(req.user._id);
      if (idx > -1) {
        review.likes.splice(idx, 1);
      } else {
        review.likes.push(req.user._id);
      }
      return res.json({ likes: review.likes });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Report a Review
// @route POST /api/reviews/:id/report
const reportReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Please specify a reason for reporting' });
    }

    if (getIsConnected()) {
      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ message: 'Review not found' });

      review.reported = true;
      review.reportReason = reason;
      await review.save();

      await Report.create({
        review: id,
        reportedBy: req.user._id,
        reason,
        status: 'pending',
      });

      return res.json({ message: 'Review reported for moderation successfully' });
    } else {
      const store = getStore();
      const review = store.reviews.find(r => r._id === id);
      if (!review) return res.status(404).json({ message: 'Review not found' });

      review.reported = true;
      review.reportReason = reason;

      store.reports.push({
        _id: 'rep_' + Date.now(),
        review: id,
        reportedBy: { _id: req.user._id, name: req.user.name, email: req.user.email },
        reason,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      return res.json({ message: 'Review reported for moderation successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHostelReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleLikeReview,
  reportReview,
};
