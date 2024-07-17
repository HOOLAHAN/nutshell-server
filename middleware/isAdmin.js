// middleware/isAdmin.js

const User = require('../models/userModel');

const isAdmin = async (req, res, next) => {
  console.log("isAdmin middleware called");
  
  try {
    const user = await User.findOne({ _id: req.user._id }).select('role');
    
    if (!user) {
      console.error('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User Role:', user.role);

    if (user.role === 'admin') {
      next();
    } else {
      console.warn('Access denied: User is not an admin');
      res.status(403).json({ error: 'Access denied. You are not authorized.' });
    }
  } catch (error) {
    console.error('isAdmin Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = isAdmin;
