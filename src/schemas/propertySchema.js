const { z } = require('zod');

const createPropertySchema = z.object({
    ownerId: z.number().int().positive(),
    title: z.string().min(5),
    city: z.string().min(2),
    country: z.string().min(2),
    pricePerNight: z.number().positive(),
    bedrooms: z.number().int().min(0),
    status: z.enum(['draft', 'live', 'under_offer', 'sold', 'withdrawn']).optional(),
});

module.exports = { createPropertySchema };