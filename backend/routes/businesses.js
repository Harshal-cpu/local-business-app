const express = require('express');
const Business = require('../models/Business');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all businesses
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const businesses = await Business.find(query).populate('owner', 'fullName email');
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get business by ID
router.get('/:id', async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate('owner', 'fullName email');
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create business (protected)
router.post('/', auth, async (req, res) => {
  try {
    const businessData = {
      ...req.body,
      owner: req.userId
    };
    
    const business = new Business(businessData);
    await business.save();
    res.status(201).json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update business (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const business = await Business.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      req.body,
      { new: true }
    );
    
    if (!business) {
      return res.status(404).json({ message: 'Business not found or unauthorized' });
    }
    
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete business (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const business = await Business.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    
    if (!business) {
      return res.status(404).json({ message: 'Business not found or unauthorized' });
    }
    
    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
