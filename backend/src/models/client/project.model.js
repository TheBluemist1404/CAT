const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    content: { type: String, default: '' },
    language: {
      type: String,
      required: true,
      enum: ['javascript', 'python', 'cpp'],
    },
  },
  { timestamps: true },
);

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, 
    files: [fileSchema], 
    folders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
      },
    ],
  },
  { timestamps: true },
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    files: [fileSchema], 
    folders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true },
);

const Folder = mongoose.model('Folder', folderSchema);
const Project = mongoose.model('Project', projectSchema);

module.exports = { Project, Folder };
