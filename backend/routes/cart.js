const router = require('express').Router();
const ctrl = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/',                    ctrl.getCart);
router.post('/add',                ctrl.addToCart);
router.put('/item/:itemId',        ctrl.updateCartItem);
router.delete('/item/:itemId',     ctrl.removeCartItem);
router.delete('/clear',            ctrl.clearCart);

module.exports = router;
