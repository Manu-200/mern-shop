const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.MONGO_URI) {
  console.error('❌ ERROR: MONGO_URI not found in backend/.env file.');
  console.error('Please ensure the file exists and contains the correct connection string.');
  process.exit(1);
}

const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const products = [
  {
    name: 'Merino Wool Turtleneck',
    description: 'Luxuriously soft 100% merino wool turtleneck. Temperature-regulating, naturally odor-resistant, and crafted for lasting comfort across seasons.',
    price: 15700,
    comparePrice: 19900,
    category: 'clothing',
    brand: 'Loro & Co',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'
    ],
    stock: 45,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Ivory', 'Charcoal', 'Sage'],
    tags: ['wool', 'winter', 'turtleneck'],
    featured: true,
    rating: 4.8,
    numReviews: 124,
    sold: 380
  },
  {
    name: 'Structured Linen Blazer',
    description: 'Clean-lined linen blazer with a relaxed yet refined silhouette. Unlined for breathability. Perfect for transitional dressing.',
    price: 26500,
    comparePrice: 34900,
    category: 'clothing',
    brand: 'Atelier Shopshere',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4b1b26?w=600&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80'
    ],
    stock: 28,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Sand', 'Navy', 'Black'],
    tags: ['blazer', 'linen', 'summer', 'office'],
    featured: true,
    rating: 4.6,
    numReviews: 89,
    sold: 210
  },
  {
    name: 'Wide-Leg Trousers',
    description: 'High-waisted wide-leg trousers in a flowing crepe fabric. A modern wardrobe staple that pairs effortlessly with both casual and formal pieces.',
    price: 12000,
    category: 'clothing',
    brand: 'Atelier Shopshere',
    images: [
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80'
    ],
    stock: 52,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Ecru', 'Black', 'Terracotta'],
    tags: ['trousers', 'wide-leg', 'minimalist'],
    featured: false,
    rating: 4.5,
    numReviews: 67,
    sold: 195
  },
  {
    name: 'Leather Tote Bag',
    description: 'Full-grain vegetable-tanned leather tote. Develops a beautiful patina over time. Fits a 15" laptop. Hand-stitched with brass hardware.',
    price: 39800,
    comparePrice: 48000,
    category: 'bags',
    brand: 'Cuir du Nord',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80'
    ],
    stock: 15,
    colors: ['Tan', 'Black', 'Burgundy'],
    tags: ['leather', 'tote', 'work bag'],
    featured: true,
    rating: 4.9,
    numReviews: 203,
    sold: 440
  },
  {
    name: 'Crossbody Mini Bag',
    description: 'Compact pebbled leather crossbody with an adjustable strap. Holds your essentials with elegant ease.',
    price: 17400,
    category: 'bags',
    brand: 'Cuir du Nord',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80'
    ],
    stock: 32,
    colors: ['White', 'Camel', 'Black'],
    tags: ['crossbody', 'mini', 'leather'],
    featured: false,
    rating: 4.7,
    numReviews: 91,
    sold: 278
  },
  {
    name: 'Chunky Knit Cardigan',
    description: 'Oversized chunky-knit cardigan in a heavyweight boucle blend. The kind of piece you reach for every time the temperature drops.',
    price: 18700,
    comparePrice: 23200,
    category: 'clothing',
    brand: 'Loro & Co',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80'
    ],
    stock: 38,
    sizes: ['S/M', 'L/XL'],
    colors: ['Oat', 'Dusty Rose', 'Forest'],
    tags: ['cardigan', 'knitwear', 'cozy'],
    featured: true,
    rating: 4.8,
    numReviews: 156,
    sold: 320
  },
  {
    name: 'Suede Chelsea Boots',
    description: 'Pull-on suede Chelsea boots with a stacked leather heel. Water-resistant treatment. Cushioned insole for all-day comfort.',
    price: 32800,
    comparePrice: 39800,
    category: 'footwear',
    brand: 'Nord Sole',
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'
    ],
    stock: 24,
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    colors: ['Camel', 'Black', 'Cognac'],
    tags: ['boots', 'chelsea', 'suede'],
    featured: true,
    rating: 4.7,
    numReviews: 112,
    sold: 265
  },
  {
    name: 'Minimalist Sneakers',
    description: 'Clean leather sneakers with a thin vulcanized sole. No logo. No excess. Just perfect proportion and premium materials.',
    price: 13700,
    category: 'footwear',
    brand: 'Nord Sole',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'
    ],
    stock: 60,
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    colors: ['White', 'Black', 'Cement'],
    tags: ['sneakers', 'minimal', 'leather'],
    featured: false,
    rating: 4.6,
    numReviews: 189,
    sold: 510
  },
  {
    name: 'Silk Slip Dress',
    description: 'Bias-cut silk charmeuse slip dress. Adjustable spaghetti straps, a deep V back. Effortlessly transitions from day to evening.',
    price: 23700,
    comparePrice: 28200,
    category: 'clothing',
    brand: 'Atelier Shopshere',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
      'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&q=80'
    ],
    stock: 20,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Champagne', 'Midnight', 'Blush'],
    tags: ['silk', 'dress', 'evening'],
    featured: false,
    rating: 4.9,
    numReviews: 78,
    sold: 155
  },
  {
    name: 'Cashmere Beanie',
    description: 'Pure Grade-A cashmere beanie, double-layered for extra warmth. Relaxed fit with a subtle ribbed texture.',
    price: 7900,
    category: 'accessories',
    brand: 'Loro & Co',
    images: [
      'https://images.unsplash.com/photo-1580197581894-e5dabae24e07?w=600&q=80',
      'https://images.unsplash.com/photo-1610398752800-146f269dfcc8?w=600&q=80'
    ],
    stock: 80,
    colors: ['Camel', 'Ivory', 'Charcoal', 'Navy'],
    tags: ['cashmere', 'hat', 'winter'],
    featured: false,
    rating: 4.8,
    numReviews: 224,
    sold: 650
  },
  {
    name: 'Linen Shirt Dress',
    description: 'Oversized shirt dress in washed linen. Button-front with a belted waist option. Gets softer with every wash.',
    price: 14500,
    category: 'clothing',
    brand: 'Atelier Shopshere',
    images: [
      'https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=600&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80'
    ],
    stock: 44,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Stone', 'White', 'Rust'],
    tags: ['linen', 'dress', 'summer'],
    featured: false,
    rating: 4.5,
    numReviews: 55,
    sold: 120
  },
  {
    name: 'Gold Chain Necklace',
    description: '18k gold-plated sterling silver paperclip chain. Lightweight and durable. Pairs beautifully with layered looks.',
    price: 6500,
    category: 'accessories',
    brand: 'Métal Doux',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80'
    ],
    stock: 100,
    colors: ['Gold', 'Silver'],
    tags: ['jewelry', 'necklace', 'gold'],
    featured: true,
    rating: 4.7,
    numReviews: 310,
    sold: 820
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared products');

    // Use Product.create() instead of .insertMany() to ensure Mongoose middleware (like slug generation from the name) is triggered.
    // .insertMany() is a direct driver operation and bypasses Mongoose's save hooks, causing the duplicate key error on the slug index.
    const created = await Product.create(products);
    console.log(`✅ Seeded ${created.length} products`);

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@shop.com' });
    if (!adminExists) {
      await User.create({ name: 'Admin User', email: 'admin@shop.com', password: 'admin123', role: 'admin' });
      console.log('✅ Admin created: admin@shop.com / admin123');
    }

    // Create demo user
    const demoExists = await User.findOne({ email: 'demo@shop.com' });
    if (!demoExists) {
      await User.create({ name: 'Demo User', email: 'demo@shop.com', password: 'demo1234' });
      console.log('✅ Demo user created: demo@shop.com / demo1234');
    }

    console.log('\n🎉 Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
