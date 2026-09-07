const Hostel = require('../models/Hostel');
const Review = require('../models/Review');
const User = require('../models/User');
const Report = require('../models/Report');
const { getIsConnected } = require('../config/db');
const { getStore } = require('../utils/mockDb');

// @desc Get platform statistics for Admin Dashboard
// @route GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    if (getIsConnected()) {
      const totalHostels = await Hostel.countDocuments();
      const totalReviews = await Review.countDocuments();
      const totalUsers = await User.countDocuments();
      const pendingReports = await Report.countDocuments({ status: 'pending' });

      return res.json({
        totalHostels,
        totalReviews,
        totalUsers,
        pendingReports,
      });
    } else {
      const store = getStore();
      return res.json({
        totalHostels: store.hostels.length,
        totalReviews: store.reviews.length,
        totalUsers: store.users.length,
        pendingReports: store.reports.filter(r => r.status === 'pending').length,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all users for Admin
// @route GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    if (getIsConnected()) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.json(users);
    } else {
      const store = getStore();
      const users = store.users.map(({ password, ...u }) => u);
      return res.json(users);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update User Role / Block (Admin)
// @route PUT /api/admin/users/:id
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (getIsConnected()) {
      const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
      return res.json(user);
    } else {
      const store = getStore();
      const user = store.users.find(u => u._id === id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      user.role = role;
      const { password, ...userData } = user;
      return res.json(userData);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get reported reviews
// @route GET /api/admin/reports
const getReportedReviews = async (req, res) => {
  try {
    if (getIsConnected()) {
      const reports = await Report.find()
        .populate({
          path: 'review',
          populate: [
            { path: 'user', select: 'name avatar email' },
            { path: 'hostel', select: 'name' }
          ]
        })
        .populate('reportedBy', 'name email')
        .sort({ createdAt: -1 });
      return res.json(reports);
    } else {
      const store = getStore();
      const reports = store.reports.map(rep => {
        const rev = store.reviews.find(r => r._id === rep.review);
        const hostelObj = rev ? store.hostels.find(h => h._id === (rev.hostel._id || rev.hostel)) : null;
        return {
          ...rep,
          review: rev ? { ...rev, hostel: hostelObj } : null,
        };
      });
      return res.json(reports);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Resolve or Dismiss Report
// @route PUT /api/admin/reports/:id
const handleReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'resolved' or 'dismissed'

    if (getIsConnected()) {
      const report = await Report.findByIdAndUpdate(id, { status }, { new: true });
      if (!report) return res.status(404).json({ message: 'Report not found' });

      if (status === 'resolved') {
        // Optionally mark review clean or remove report flag
        await Review.findByIdAndUpdate(report.review, { reported: false });
      } else if (status === 'dismissed') {
        await Review.findByIdAndUpdate(report.review, { reported: false });
      }

      return res.json(report);
    } else {
      const store = getStore();
      const report = store.reports.find(r => r._id === id);
      if (!report) return res.status(404).json({ message: 'Report not found' });
      report.status = status;

      const rev = store.reviews.find(r => r._id === report.review);
      if (rev) rev.reported = false;

      return res.json(report);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getUsers,
  updateUserRole,
  getReportedReviews,
  handleReportStatus,
};
