const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

module.exports.uploadMulti = async (req, res, next) => {
  if (req.fileValidationError) {
    res.status(400).json({
      message: 'Invalid file type',
    });
    return;
  }

  if (req.files.length > 0) {
    const images = req.files;
    const imageURLs = [];
    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path);
      imageURLs.push(result.secure_url);
    }
    req.body[req.files[0].fieldname] = imageURLs;
  }
  next();
};

module.exports.uploadSingle = async (req, res, next) => {
  if (req.fileValidationError) {
    res.status(400).json({
      message: 'Invalid file type',
    });
    return;
  }

  if (req.file) {
    const image = req.file;
    const result = await cloudinary.uploader.upload(image.path);
    req.body[req.file.fieldname] = result.secure_url;
  }
  next();
};
