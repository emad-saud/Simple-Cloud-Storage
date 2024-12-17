const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const File = require('../models/fileModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'storage');
  },
  filename: (req, file, cb) => {
    const firstOctet = file.mimetype.split('/')[0];
    let ext = file.mimetype.split('/')[1];
    if (firstOctet === 'text') ext = 'txt';
    cb(null, `user-${req.user._id}-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: multerStorage,
});

exports.uploadFile = upload.single('file');

exports.storeFile = catchAsync(async (req, res, next) => {
  const file = req.file || null;
  if (!file) {
    return next(
      new AppError('no file is found in request please try again later!', 400)
    );
  }

  console.log(file);

  const doc = await File.create({
    name: req.file.filename,
    originalName: req.file.originalname,
    user: req.user._id,
  });

  res.status(200).json({
    status: 'success',
    message: 'file uploaded successfully',
  });
});

exports.getFile = catchAsync(async (req, res, next) => {
  const file = await File.findOne({
    _id: req.params.fileId,
    user: req.user._id,
  });

  // console.log(req.params.fileId);
  // console.log(req.user._id);

  if (!file) {
    return next(new AppError('No File found with that id!', 404));
  }

  const filePath = path.join(__dirname, `../storage/${file.name}`);

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
  res.download(filePath, function (err) {
    if (err) {
      next();
    }
  });
});
