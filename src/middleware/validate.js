const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(422).json({
                error: {
                    status: 422,
                    message: 'Validation failed',
                    details: result.error.errors                }
            });
        }
        req.validatedData = result.data;
        next();
    };
};

module.exports = validate;