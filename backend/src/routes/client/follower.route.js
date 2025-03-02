const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/client/auth.middleware');
const followerController = require('../../controllers/client/follower.controller');

router.post('/follows', auth.authenticateToken, followerController.followUser);
router.delete('/follows', auth.authenticateToken, followerController.unfollowUser);
router.get('/:id/followers', auth.authenticateToken, followerController.getFollowers);
router.get('/followees', auth.authenticateToken, followerController.getFollowees);
module.exports = router;