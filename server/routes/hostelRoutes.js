const express = require('express');
const router = express.Router();
const {
  getHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel,
} = require('../controllers/hostelController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getHostels);
router.get('/:id', getHostelById);
router.post('/', protect, admin, createHostel);
router.put('/:id', protect, admin, updateHostel);
router.delete('/:id', protect, admin, deleteHostel);

module.exports = router;
