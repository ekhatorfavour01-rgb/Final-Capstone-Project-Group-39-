const errorHandlerMiddleware = (err, req, res, next) => {
    console.error('Error:', err.message);

    //Handles a common Mongoose error: Invalide format
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format',
            data:null });
    }

    //Handle duplicate key errors (e.g email aleady registered)
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate record - this value already exists',
            data:null });
    }

    // Default fallback - neve expose raw error detailes to the client
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Something went wrong, Please try again',
        data:null
    });
};

module.exports = errorHandlerMiddleware;