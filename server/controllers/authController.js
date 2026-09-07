const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');
const { getStore } = require('../utils/mockDb');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_jwt_key_hosteller_2026_safe_token', {
    expiresIn: '30d',
  });
};

// @desc Register user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, college, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields (name, email, password)' });
    }

    if (getIsConnected()) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'student',
        college: college || '',
        phone: phone || '',
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        college: user.college,
        phone: user.phone,
        savedHostels: user.savedHostels,
        token: generateToken(user._id),
      });
    } else {
      const store = getStore();
      const existing = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = {
        _id: 'u_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        college: college || '',
        phone: phone || '',
        savedHostels: [],
        createdAt: new Date().toISOString(),
      };
      store.users.push(newUser);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        college: newUser.college,
        phone: newUser.phone,
        savedHostels: newUser.savedHostels,
        token: generateToken(newUser._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (getIsConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          college: user.college,
          phone: user.phone,
          savedHostels: user.savedHostels,
          token: generateToken(user._id),
        });
      }
    } else {
      const store = getStore();
      const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user && bcrypt.compareSync(password, user.password)) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          college: user.college,
          phone: user.phone,
          savedHostels: user.savedHostels,
          token: generateToken(user._id),
        });
      }
    }

    res.status(401).json({ message: 'Invalid credentials. Please check email and password.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get User Profile
// @route GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    if (getIsConnected()) {
      const user = await User.findById(req.user._id).select('-password').populate('savedHostels');
      res.json(user);
    } else {
      const store = getStore();
      const user = store.users.find(u => u._id === req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const { password, ...userData } = user;

      // populate saved hostels
      const saved = store.hostels.filter(h => user.savedHostels?.includes(h._id));
      res.json({ ...userData, savedHostels: saved });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle Save/Bookmark Hostel
// @route POST /api/auth/save-hostel/:hostelId
const toggleSaveHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;
    if (getIsConnected()) {
      const user = await User.findById(req.user._id);
      const index = user.savedHostels.indexOf(hostelId);
      if (index > -1) {
        user.savedHostels.splice(index, 1);
      } else {
        user.savedHostels.push(hostelId);
      }
      await user.save();
      return res.json({ savedHostels: user.savedHostels });
    } else {
      const store = getStore();
      const user = store.users.find(u => u._id === req.user._id);
      if (!user.savedHostels) user.savedHostels = [];
      const idx = user.savedHostels.indexOf(hostelId);
      if (idx > -1) {
        user.savedHostels.splice(idx, 1);
      } else {
        user.savedHostels.push(hostelId);
      }
      return res.json({ savedHostels: user.savedHostels });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, toggleSaveHostel };
