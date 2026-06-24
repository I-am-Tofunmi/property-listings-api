const express = require('express');
const router = express.Router();
const propertyRepo = require('../repositories/propertyRepository');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

// GET /properties - public
router.get('/', async (req, res) => {
    const properties = await propertyRepo.findAll();
    res.json({ data: properties });
});

// GET /properties/:id - public
router.get('/:id', async (req, res) => {
    const property = await propertyRepo.findById(parseInt(req.params.id));
    if (!property) {
        return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ data: property });
});

// POST /properties - admin only
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
    const { title, city, country, pricePerNight, bedrooms, status } = req.body;
    const property = await propertyRepo.create({
        ownerId: req.user.sub,
        title, city, country, pricePerNight, bedrooms, status
    });
    res.status(201).json({ data: property });
});

// PATCH /properties/:id - admin only
router.patch('/:id', requireAuth, requireRole('admin'), async (req, res) => {
    const property = await propertyRepo.update(parseInt(req.params.id), req.body);
    if (!property) {
        return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ data: property });
});

// DELETE /properties/:id - admin only
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
    const property = await propertyRepo.remove(parseInt(req.params.id));
    if (!property) {
        return res.status(404).json({ error: 'Property not found' });
    }
    res.status(204).send();
});

module.exports = router;