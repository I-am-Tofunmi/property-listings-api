function errorHandler(err, req, res, next) {
    console.error(err.stack);

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ 
            error: 'invalid_json', 
            message: 'Request body is not valid JSON' 
        });
    }

    res.status(500).json({ 
        error: 'internal_server_error', 
        message: 'Something went wrong' 
    });
}

module.exports = errorHandler;