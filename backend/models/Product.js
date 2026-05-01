const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name required'],
    trim: true,
    maxlength: [200, 'Name too long']
  },
  slug: { type: String, unique: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  comparePrice: { type: Number, min: 0 }, // original price for sale display
  category: {
    type: String,
    required: true,
    enum: ['clothing', 'accessories', 'footwear', 'bags', 'beauty', 'home'],
    lowercase: true
  },
  brand: { type: String, trim: true },
  images: [{ type: String }],
  stock: { type: Number, required: true, default: 0, min: 0 },
  sold: { type: Number, default: 0 },
  sizes: [String],
  colors: [String],
  tags: [String],
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Auto-generate slug from name
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

// Recalculate rating when reviews change
productSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    this.rating = this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);
