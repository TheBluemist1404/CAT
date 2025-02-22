const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/client/auth.middleware');
const projectController = require('../../controllers/client/project.controller');

router.post('/', auth.authenticateToken, projectController.createProject);
router.get('/:id', auth.authenticateToken, projectController.getProject);
router.patch('/:id', auth.authenticateToken, projectController.updateProject);
router.delete('/:id', auth.authenticateToken, projectController.deleteProject);
router.get('/', auth.authenticateToken, projectController.getProjects);
router.patch('/:id/collaborators', auth.authenticateToken, projectController.addCollaborator);
router.patch('/:id/remove-collaborator', auth.authenticateToken, projectController.removeCollaborator);

module.exports = router;
