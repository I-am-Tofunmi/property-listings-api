const express = require('express');
const router = express.Router();
const enquiryRepo = require('../repositories/enquiryRepository');
const propertyRepo = require('../repositories/propertyRepository');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

// GET /enquiries - admin only
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
    const enquiries = await enquiryRepo.findAll();
    res.json({ data: enquiries });
});

// GET /enquiries/:id - admin or user who created it
router.get('/:id', requireAuth, async (req, res) => {
    const enquiry = await enquiryRepo.findById(parseInt(req.params.id));
    if (!enquiry) {
        return res.status(404).json({ error: 'not_found', message: 'Enquiry not found' });
    }

    if (req.user.role !== 'admin' && req.user.sub !== enquiry.userId) {
        return res.status(403).json({ error: 'forbidden', message: 'You can only view your own enquiries' });
    }

    res.json({ data: enquiry });
});

// POST /enquiries - any logged in user
router.post('/', requireAuth, async (req, res) => {
    const { propertyId, message, source } = req.body;

    const property = await propertyRepo.findById(parseInt(propertyId));
    if (!property) {
        return res.status(404).json({ error: 'not_found', message: 'Property not found' });
    }

    const enquiry = await enquiryRepo.create({
        propertyId,
        userId: req.user.sub,
        message,
        source
    });
    res.status(201).json({ data: enquiry });
});

module.exports = router;