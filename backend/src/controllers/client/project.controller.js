const { Project } = require('../../models/client/project.model');

// [POST] /api/v1/projects
module.exports.createProject = async (req, res) => {
  try {
    const { name, description, files, folders } = req.body;

    const project = new Project({
      name,
      description,
      owner: new mongoose.Types.ObjectId(req.user.id),
      files,
      folders: folders || [],
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// [PATCH] /api/v1/projects/:id
module.exports.updateProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (
      !project.owner.equals(userId) &&
      !project.collaborators.includes(new mongoose.Types.ObjectId(userId))
    ) {
      res.status(403).json({ message: 'Access denied!' });
      return;
    }

    const updates = req.body;
    const savedProject = await project.updateOne(updates, {
      new: true,
    });

    res.status(200).json({
      message: 'Update successfully',
      project: savedProject,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [GET] /api/v1/projects/:id
module.exports.getProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const projects = await Project.aggregate([
      {
        $match: {
          deleted: false,
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'folders',
          localField: 'folders',
          foreignField: '_id',
          as: 'folders',
        },
      },
      {
        $unwind: {
          path: '$folders',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'folders',
          localField: 'folders.folders',
          foreignField: '_id',
          as: 'folders.subfolders',
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          description: { $first: '$description' },
          owner: { $first: '$owner' },
          files: { $first: '$files' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          folders: { $push: '$folders' },
        },
      },
      {
        $sort: { createdAt: -1 }, // Sort by most recent projects
      },
    ]);

    if (!projects.length) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (
      !projects[0].owner.equals(userId) &&
      !projects[0].collaborators.includes(new mongoose.Types.ObjectId(userId))
    ) {
      res.status(403).json({ message: 'Access denied!' });
      return;
    }

    res.status(200).json(projects[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [DELETE] /api/v1/projects/:id
module.exports.deleteProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (
      !project.owner.equals(userId) &&
      !project.collaborators.includes(new mongoose.Types.ObjectId(userId))
    ) {
      res.status(403).json({ message: 'Access denied!' });
      return;
    }

    await project.updateOne({
      deleted: true,
    });

    res.status(200).json({
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// TODO:
// [PATCH] /api/v1/projects/:id/collaborators
// [PATCH] /api/v1/projects/:id/remove-collaborator

