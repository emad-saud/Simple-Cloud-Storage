const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'File must have a name'],
  },
  originalName: {
    type: String,
    required: [true, 'File must have an originalName'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'File must have User!'],
  },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
