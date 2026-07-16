const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[\d\s\-\+\(\)]+$/.test(v);
      },
      message: 'Invalid phone number format'
    }
  },
  whatsapp: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^[\d\s\-\+\(\)]+$/.test(v);
      },
      message: 'Invalid WhatsApp number format'
    }
  },
  address: {
    type: String,
    required: true
  },
  mapLink: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: ['restaurant', 'retail', 'salon', 'fitness', 'automotive', 'healthcare', 'professional', 'home-services', 'entertainment']
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'
  },
  hours: {
    type: String,
    default: '9:00 AM - 6:00 PM'
  },
  upiId: String,
  rating: {
    type: Number,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  }
}, {
  timestamps: true
});

// Indexes for search optimization
businessSchema.index({ location: '2dsphere' });
businessSchema.index({ name: 'text', description: 'text' });
businessSchema.index({ category: 1 });
businessSchema.index({ owner: 1 });

module.exports = mongoose.model('Business', businessSchema);
