const express = require('express');
const router = express.Router();
const {
  getHostelReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleLikeReview,
  reportReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/hostel/:hostelId', getHostelReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/like', protect, toggleLikeReview);
router.post('/:id/report', protect, reportReview);

module.exports = router;
