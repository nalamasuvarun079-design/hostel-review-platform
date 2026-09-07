const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  updateUserRole,
  getReportedReviews,
  handleReportStatus,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUserRole);
router.get('/reports', getReportedReviews);
router.put('/reports/:id', handleReportStatus);

module.exports = router;
