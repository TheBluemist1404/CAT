const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/post.controller');
const auth = require('../../middlewares/client/auth.middleware');
const validate = require('../../middlewares/client/validation.middleware');
const multer = require('../../middlewares/client/multer.middleware');
const uploadCloud = require('../../middlewares/client/uploadCloud.middleware');
const voteController = require('../../controllers/client/vote.controller');
const commentController = require('../../controllers/client/comment.controller');
const searchController = require('../../controllers/client/search.controller');

router.get('/', controller.index);
router.post(
  '/create',
  auth.authenticateToken,
  multer.array('images'),
  uploadCloud.uploadMulti,
  validate.validateCreate,
  controller.create,
);
router.get('/detail/:id', controller.detail);
router.patch(
  '/vote/:typeVote/:id',
  auth.authenticateToken,
  voteController.vote,
);
router.post('/comment/:id', auth.authenticateToken, commentController.comment);
router.post('/reply/:id', auth.authenticateToken, commentController.reply);
router.get('/search', searchController.search);
router.get('/tags', controller.tags);
router.post('/save/:id', auth.authenticateToken, controller.save);
router.patch(
  '/edit/:id',
  auth.authenticateToken,
  multer.array('images'),
  uploadCloud.uploadMulti,
  validate.validateCreate,
  controller.edit,
);
router.delete('/delete/:id', auth.authenticateToken, controller.delete);
router.patch('/change-status/:typeStatus/:id', auth.authenticateToken, controller.changeStatus);

module.exports = router;
