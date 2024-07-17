// routes/user.js

const express = require('express');
const { check } = require('express-validator');

// controller functions
const { signupUser, loginUser } = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// login route
router.post('/login', [
  check('email').isEmail(),
  check('password').isLength({ min: 6 })
], loginUser);

// signup route
router.post('/signup', [
  check('email').isEmail(),
  check('password').isLength({ min: 6 })
], signupUser);

// admin-only route
router.get('/admin', requireAuth, isAdmin, (req, res) => {
  // This route is only accessible to administrators
  res.json({ message: 'Welcome to the admin page!' });
});

module.exports = router;
