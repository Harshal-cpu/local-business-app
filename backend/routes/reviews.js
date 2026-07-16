const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('customer', 'fullName')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review
router.post('/', auth, async (req, res) => {
  try {
    const review = new Review({
      ...req.body,
      customer: req.userId
    });
    await review.save();

    // Update product rating
    const reviews = await Review.find({ product: req.body.product });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(req.body.product, {
      rating: avgRating,
      reviewCount: reviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
