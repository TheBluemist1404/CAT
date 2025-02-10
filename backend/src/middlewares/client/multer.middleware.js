const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const multer = require('multer');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + file.originalname;
    cb(null, `${uniquePrefix}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      req.fileValidationError = "Forbidden extension";
      cb(null, false);
    }
  },
});

module.exports = upload;
