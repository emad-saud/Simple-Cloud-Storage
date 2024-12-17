const express = require('express');

const authController = require('../controllers/authController');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/login', viewsController.getLogin);
router.get('/sign-up', viewsController.getSignUp);

module.exports = router;
