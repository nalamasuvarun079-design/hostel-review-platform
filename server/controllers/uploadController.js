const path = require('path');

// @desc Upload Image File
// @route POST /api/upload
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please attach an image file' });
    }

    // Return base64 data URI for instant client rendering or local path
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    return res.json({
      message: 'Image uploaded successfully',
      url: base64Image,
      filename: req.file.originalname,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadImage };
