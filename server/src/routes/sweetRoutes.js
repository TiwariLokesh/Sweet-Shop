const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.status(501).json({ message: 'Not implemented' }));
router.post('/', (req, res) => res.status(501).json({ message: 'Not implemented' }));
router.get('/search', (req, res) => res.status(501).json({ message: 'Not implemented' }));
router.put('/:id', (req, res) => res.status(501).json({ message: 'Not implemented' }));
router.delete('/:id', (req, res) => res.status(501).json({ message: 'Not implemented' }));
router.post('/:id/purchase', (req, res) => res.status(501).json({ message: 'Not implemented' }));
router.post('/:id/restock', (req, res) => res.status(501).json({ message: 'Not implemented' }));

module.exports = router;
