const { z } = require('zod');

const createEnquirySchema = z.object({
    propertyId: z.number().int().positive(),
    userId: z.number().int().positive(),
    message: z.string().min(10),
    source: z.enum(['web_form', 'phone', 'email', 'referral']),
});

module.exports = { createEnquirySchema };