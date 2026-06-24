const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const userRepo = require('../repositories/userRepository');
const requireAuth = require('../middleware/requireAuth');
const { registerSchema, loginSchema } = require('../schemas/authSchema');

const router = express.Router();

// POST /auth/register
router.post('/register', async (req, res) => {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(422).json({
            error: 'validation_error',
            message: result.error.issues[0].message
        });
    }
    const { name, email, password } = result.data;

    const existing = await userRepo.findByEmail(email);
    if (existing) {
        return res.status(409).json({ error: 'email_taken', message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userRepo.createUser({ name, email, passwordHash });

    const token = jwt.sign(
        { sub: user.id, email: user.email, role: user.role },
        config.JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.status(201).json({ user, token });
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: 'validation_error',
            message: result.error.issues[0].message  // ← fix here
        });
    }
    const { email, password } = result.data;

    const user = await userRepo.findByEmail(email);
    if (!user) {
        return res.status(401).json({ error: 'invalid_credentials', message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
        return res.status(401).json({ error: 'invalid_credentials', message: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { sub: user.id, email: user.email, role: user.role },
        config.JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
});

// POST /auth/logout
router.post('/logout', requireAuth, (req, res) => {
    res.status(204).send();
});

// GET /auth/me
router.get('/me', requireAuth, async (req, res) => {
    const user = await userRepo.findById(req.user.sub);
    if (!user) {
        return res.status(404).json({ error: 'not_found', message: 'User not found' });
    }
    res.json({ user });
});

module.exports = router;