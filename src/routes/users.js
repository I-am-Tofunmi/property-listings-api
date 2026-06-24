const express = require('express');
const router = express.Router();
const userRepo = require('../repositories/userRepository');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

// GET /users - admin only
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
    const users = await userRepo.findAll();
    res.json({ data: users });
});

// GET /users/:id - self or admin
router.get('/:id', requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);

    if (req.user.role !== 'admin' && req.user.sub !== id) {
        return res.status(403).json({ error: 'forbidden', message: 'You can only view your own profile' });
    }

    const user = await userRepo.findById(id);
    if (!user) {
        return res.status(404).json({ error: 'not_found', message: 'User not found' });
    }
    res.json({ data: user });
});

// PATCH /users/:id - self or admin
router.patch('/:id', requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);

    if (req.user.role !== 'admin' && req.user.sub !== id) {
        return res.status(403).json({ error: 'forbidden', message: 'You can only update your own profile' });
    }

    const user = await userRepo.updateUser(id, req.body);
    if (!user) {
        return res.status(404).json({ error: 'not_found', message: 'User not found' });
    }
    res.json({ data: user });
});

// DELETE /users/:id - admin only
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
    const user = await userRepo.removeUser(parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ error: 'not_found', message: 'User not found' });
    }
    res.status(204).send();
});

module.exports = router;