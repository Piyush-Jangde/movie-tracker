const errorHandler = (err,req,res,next) => {
    console.error(err.stack);

    // Invalid Mongo ObjectId
    if (err.name === 'CastError') {
        err.statusCode = 400;
        err.message = 'Invalid watchlist ID';
    }

    res.status(err.statusCode || 500).json({
        message : err.message || 'Server error'
    });
};

module.exports= errorHandler;