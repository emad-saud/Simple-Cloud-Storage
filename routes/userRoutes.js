const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  );

router.route('/sign-up').post(authController.signUp);
router.route('/login').post(authController.login);

module.exports = router;
