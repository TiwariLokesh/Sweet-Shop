const express = require('express');
const router = express.Router();
const sweetController = require('../controllers/sweetController');
const { auth, requireAdmin } = require('../middleware/auth');

router.use(auth);

router.get('/', sweetController.list);
router.post('/', sweetController.create);
router.get('/search', sweetController.search);
router.put('/:id', sweetController.update);
router.delete('/:id', requireAdmin, sweetController.remove);
router.post('/:id/purchase', sweetController.purchase);
router.post('/:id/restock', requireAdmin, sweetController.restock);

module.exports = router;
