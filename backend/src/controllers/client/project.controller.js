const mongoose = require('mongoose');
const { Project, Folder } = require('../../models/client/project.model');
const User = require('../../models/client/user.model');
const wss = require('../../index');

async function getFolderStructure(folderId) {
  const folder = await Folder.findById(folderId).lean();
  if (!folder) return null;

  const childFolders = await Promise.all(
    folder.folders.map(async childId => await getFolderStructure(childId)),
  );

  return { ...folder, folders: childFolders.filter(Boolean) };
}

// [POST] /api/v1/projects
module.exports.createProject = async (req, res) => {
  try {
    const { name, description, files, folders } = req.body;

    const project = new Project({
      name,
      description,
      owner: new mongoose.Types.ObjectId('' + req.user.id),
      files,
      folders: folders || [],
    });

    const savedProject = await project.save();

    // wss.clients.forEach((client) => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(JSON.stringify({type: 'new_project', project: savedProject}))
    //   }
    // })

    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// [PATCH] /api/v1/projects/:id
module.exports.updateProject = async (req, res) => {
  try {
    const userId = '' + req.user.id;
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
    const savedProject = await Project.findByIdAndUpdate(project._id, updates, {
      new: true,
    });

    if (wss.wss) {
      wss.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({ type: 'update_project', project: savedProject }),
          );
        }
      });
    }

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
    const userId = '' + req.user.id;
    const id = '' + req.params.id;

    const projects = await Project.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          deleted: false,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'collaborators',
          foreignField: '_id',
          as: 'collaborators',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          remarks: 1,
          owner: { _id: 1, fullName: 1, avatar: 1, email: 1 },
          files: 1,
          folders: 1,
          createdAt: 1,
          updatedAt: 1,
          collaborators: { _id: 1, fullName: 1, avatar: 1, email: 1 },
        },
      },
    ]);

    if (!projects.length) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (
      !projects[0].owner[0]._id.equals(userId) &&
      !projects[0].collaborators.some(collab => collab._id.equals(userId))
    ) {
      res.status(403).json({ message: 'Access denied!' });
      return;
    }

    const folders = await Promise.all(
      projects[0].folders.map(
        async folderId => await getFolderStructure(folderId),
      ),
    );

    res.status(200).json({ ...projects[0], folders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [DELETE] /api/v1/projects/:id
module.exports.deleteProject = async (req, res) => {
  try {
    const userId = '' + req.user.id;
    const id = '' + req.params.id;

    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (
      !project.owner.equals(userId) // Only owner can delete project
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

// [GET] /api/v1/projects
module.exports.getProjects = async (req, res) => {
  try {
    const userId = '' + req.user.id;
    const projects = await Project.aggregate([
      {
        $match: {
          deleted: false,
          $or: [
            { owner: new mongoose.Types.ObjectId(userId) },
            { collaborators: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'collaborators',
          foreignField: '_id',
          as: 'collaborators',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          owner: {
            _id: 1,
            fullName: 1,
            avatar: 1,
            email: 1,
          },
          files: 1,
          folders: 1,
          createdAt: 1,
          updatedAt: 1,
          collaborators: { _id: 1, fullName: 1, avatar: 1, email: 1 },
        },
      },
    ]);

    projects.forEach(async project => {
      const folders = await Promise.all(
        project.folders.map(
          async folderId => await getFolderStructure(folderId),
        ),
      );
      project.folders = folders;
    });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// TODO:
// [PATCH] /api/v1/projects/:id/collaborators
module.exports.addCollaborator = async (req, res) => {
  try {
    const id = '' + req.params.id;
    const email = '' + req.body.email;
    const userId = '' + req.user.id;

    const collaborator = await User.findOne({
      email: email,
      deleted: false,
    });

    if (!collaborator) {
      res.status(404).json({
        message: 'User not found!',
      });
      return;
    }
    const project = await Project.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        owner: new mongoose.Types.ObjectId(userId),
        deleted: false,
      },
      {
        $addToSet: { collaborators: collaborator._id },
      },
      {
        new: true,
      },
    );

    if (!project) {
      res.status(404).json({
        message: 'Project not found!',
      });
      return;
    }

    res.status(200).json({
      message: 'Add collaborators successfully!',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// [PATCH] /api/v1/projects/:id/remove-collaborator
module.exports.removeCollaborator = async (req, res) => {
  const id = '' + req.params.id;
  const email = '' + req.body.email;
  const userId = '' + req.user.id;

  const collaborator = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!collaborator) {
    res.status(404).json({
      message: 'User not found!',
    });
    return;
  }

  const project = await Project.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(id),
      owner: new mongoose.Types.ObjectId(userId),
      deleted: false,
    },
    {
      $pull: { collaborators: collaborator._id },
    },
    {
      new: true,
    },
  );

  if (!project) {
    res.status(404).json({
      message: 'Project not found!',
    });
    return;
  }

  res.status(200).json({
    message: 'Remove collaborators successfully!',
  });
};

// [PATCH] /api/v1/projects/:id/remarks
module.exports.changeRemark = async (req, res) => {
  const id = '' + req.params.id;
  const userId = '' + req.user.id;
  const isRemarked = req.body.isRemarked;

  const user = await User.findOne({
    _id: new mongoose.Types.ObjectId(id),
    deleted: false,
  });

  if (!user) {
    res.status(404).json({
      message: 'User not found!',
    });
    return;
  }

  const project = await Project.findOne({
    _id: new mongoose.Types.ObjectId(id),
    deleted: false,
  });

  if (!project) {
    res.status(404).json({
      message: 'Project not found!',
    });
    return;
  }

  if (
    !project.owner.equals(userId) &&
    !project.collaborators.includes(new mongoose.Types.ObjectId(userId))
  ) {
    res.status(403).json({ message: 'Access denied!' });
    return;
  }

  if (isRemarked) {
    await Project.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        deleted: false,
      },
      {
        $addToSet: { remarks: user._id },
      },
    );
  } else {
    await Project.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        deleted: false,
      },
      {
        $pull: { remarks: user._id },
      },
    );
  }

  res.status(200).json({
    message: 'Update successfully!',
    isRemarked,
  });
};
