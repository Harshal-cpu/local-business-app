const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
  },
  stock: {
    type: Number,
    default: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ business: 1 });
productSchema.index({ owner: 1 });

module.exports = mongoose.model('Product', productSchema);
