const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET /api/cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock slug');
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    const { subtotal, itemCount } = await cart.calcTotals();
    res.json({ success: true, cart, subtotal, itemCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/cart/add
exports.addToCart = async (req, res) => {
  const { productId, quantity = 1, size, color } = req.body;
  if (!productId) return res.status(400).json({ message: 'Product ID required' });
  try {
    const product = await Product.findById(productId);
    if (!product || !product.isActive) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const idx = cart.items.findIndex(i => i.product.toString() === productId && i.size === size && i.color === color);
    if (idx > -1) {
      cart.items[idx].quantity = Math.min(cart.items[idx].quantity + quantity, product.stock);
    } else {
      cart.items.push({ product: productId, quantity, size, color });
    }
    await cart.save();
    await cart.populate('items.product', 'name price images stock slug');
    const { subtotal, itemCount } = await cart.calcTotals();
    res.json({ success: true, cart, subtotal, itemCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/cart/item/:itemId
exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (quantity <= 0) {
      item.deleteOne();
    } else {
      item.quantity = quantity;
    }
    await cart.save();
    await cart.populate('items.product', 'name price images stock slug');
    const { subtotal, itemCount } = await cart.calcTotals();
    res.json({ success: true, cart, subtotal, itemCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/cart/item/:itemId
exports.removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
    await cart.save();
    await cart.populate('items.product', 'name price images stock slug');
    const { subtotal, itemCount } = await cart.calcTotals();
    res.json({ success: true, cart, subtotal, itemCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/cart/clear
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
