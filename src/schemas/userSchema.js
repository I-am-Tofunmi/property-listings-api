const { z } = require('zod');

const createUserSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    role: z.enum(['owner', 'renter']),
});

module.exports = { createUserSchema };