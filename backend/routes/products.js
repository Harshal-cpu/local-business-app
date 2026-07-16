const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const cache = require('../utils/cache');
const router = express.Router();

// Get all products (with optional filters and pagination)
router.get('/', async (req, res) => {
  try {
    const { business, search, page = 1, limit = 12 } = req.query;
    const cacheKey = `products:${business || 'all'}:${search || 'none'}:${page}:${limit}`;
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    let query = {};
    
    if (business) query.business = business;
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(query);
    
    let productsQuery = Product.find(query)
      .populate('business', 'name category email phone address')
      .skip(skip)
      .limit(parseInt(limit));
    
    if (search) {
      productsQuery = productsQuery.select({ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }
    
    const products = await productsQuery;

    const result = {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    };

    // Cache for 2 minutes
    cache.set(cacheKey, result, 2 * 60 * 1000);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's products
router.get('/my-products', auth, async (req, res) => {
  try {
    const products = await Product.find({ owner: req.userId }).populate('business', 'name _id');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post('/', auth, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      owner: req.userId
    };
    
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      req.body,
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
