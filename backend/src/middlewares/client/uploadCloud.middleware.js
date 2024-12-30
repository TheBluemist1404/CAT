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

  try {
    const images = req.files;
    console.log(req.files);
    console.log('-------');
    const imageURLs = [];
    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path);
      imageURLs.push(result.secure_url);
    }
    req.body.images = imageURLs;
    next();
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

module.exports.uploadSingle = async (req, res, next) => {
  if (req.fileValidationError) {
    res.status(400).json({
      message: 'Invalid file type',
    });
    return;
  }
  
  try {
    const image = req.file;
    console.log(req.file);
    const result = await cloudinary.uploader.upload(image.path);
    req.body[req.file.fieldname] = result.secure_url;
    next();
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
