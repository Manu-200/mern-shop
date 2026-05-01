const router = require('express').Router();
const ctrl = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);

router.post('/',                      ctrl.placeOrder);
router.get('/',                       ctrl.getMyOrders);
router.get('/:id',                    ctrl.getOrder);

// Admin
router.get('/admin/all',              adminOnly, ctrl.getAllOrders);
router.put('/admin/:id/status',       adminOnly, ctrl.updateOrderStatus);

module.exports = router;
