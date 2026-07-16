const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working!' });
});

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Register request received:', req.body);
    
    const { fullName, email, password, role } = req.body;
    
    // Validate input
    if (!fullName || !email || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user exists
    console.log('🔍 Checking if user exists:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    console.log('👤 Creating new user...');
    const user = new User({ 
      fullName, 
      email, 
      password, 
      role: role || 'customer' 
    });
    
    await user.save();
    console.log('✅ User saved to database:', user._id);

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('🔑 Token created');
    
    // Check if user was actually saved
    const savedUser = await User.findById(user._id);
    console.log('📊 User in database:', savedUser ? 'Found' : 'Not found');
    
    res.status(201).json({ 
      token, 
      user: { id: user._id, fullName, email, role: user.role },
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login request:', req.body);
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ Login successful');
    
    res.json({ 
      token, 
      user: { id: user._id, fullName: user.fullName, email, role: user.role },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all users (for debugging)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    console.log('📊 Total users in database:', users.length);
    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
