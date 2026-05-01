const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;

// POST /api/orders — place order from cart
exports.placeOrder = async (req, res) => {
  const { shippingAddress, paymentMethod, notes } = req.body;
  if (!shippingAddress?.street) return res.status(400).json({ message: 'Shipping address required' });
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock isActive');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    // Validate stock
    for (const item of cart.items) {
      if (!item.product?.isActive) return res.status(400).json({ message: `${item.product?.name} is no longer available` });
      if (item.product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${item.product.name}` });
    }

    const subtotal = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;

    const orderItems = cart.items.map(i => ({
      product: i.product._id,
      name: i.product.name,
      image: i.product.images[0],
      price: i.product.price,
      quantity: i.quantity,
      size: i.size,
      color: i.color
    }));

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'paid', // simulated — integrate Stripe in real app
      paidAt: new Date(),
      subtotal: Math.round(subtotal * 100) / 100,
      shippingCost,
      tax,
      total,
      notes
    });

    // Decrement stock & increment sold
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity, sold: item.quantity }
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders — user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/admin/all — admin only
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { orderStatus: status } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).populate('user', 'name email').sort('-createdAt').skip(skip).limit(Number(limit)),
      Order.countDocuments(filter)
    ]);
    res.json({ success: true, orders, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/orders/admin/:id/status — admin only
exports.updateOrderStatus = async (req, res) => {
  const { orderStatus, trackingNumber } = req.body;
  try {
    const update = { orderStatus };
    if (trackingNumber) update.trackingNumber = trackingNumber;
    if (orderStatus === 'delivered') update.deliveredAt = new Date();
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
