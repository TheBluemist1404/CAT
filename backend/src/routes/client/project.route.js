const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/client/auth.middleware');
const projectController = require('../../controllers/client/project.controller');

router.post('/', auth.authenticateToken, projectController.createProject);
router.get('/:id', auth.authenticateToken, projectController.getProject);
router.patch('/:id', auth.authenticateToken, projectController.updateProject);
router.delete('/:id', auth.authenticateToken, projectController.deleteProject);

module.exports = router;