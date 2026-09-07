const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, toggleSaveHostel } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/save-hostel/:hostelId', protect, toggleSaveHostel);

module.exports = router;
