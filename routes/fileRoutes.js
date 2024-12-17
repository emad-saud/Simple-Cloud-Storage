const express = require('express');

const fileController = require('../controllers/fileController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/upload',
  authController.protect,
  fileController.uploadFile,
  fileController.storeFile
);

router.route('/:fileId').get(authController.protect, fileController.getFile);

module.exports = router;
