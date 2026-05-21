const {body,param,query,validationResult}=require('express-validator');

const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
};


const validateWatchlist = [
    body('title')
        .notEmpty()
        .withMessage('Title is required'),
    body('type')
        .isIn(['movie','series'])
        .withMessage('Type must be movie or series'),
    body('status')
        .optional()
        .isIn(['watching','completed','planned'])
        .withMessage('Invalid status'),
    body('rating')
        .optional()
        .isFloat({min:0, max:10})
        .withMessage('Rating must be between 0 and 10'),
    
    validationMiddleware
]

const validateWatchlistUpdate = [
    body('title')
        .optional()
        .notEmpty()
        .withMessage('Title cannot be empty'),
    body('type')
        .optional()
        .isIn(['movie','series'])
        .withMessage('Type must be movie or series'),
    body('status')
        .optional()
        .isIn(['watching','completed','planned'])
        .withMessage('Invalid status'),
    body('rating')
        .optional()
        .isFloat({min:0, max:10})
        .withMessage('Rating must be between 0 and 10'),
        
    validationMiddleware
]

const validateWatchlistId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid watchlist ID'),

    validationMiddleware
]

const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Limit must be a positive integer'),

    validationMiddleware
];
module.exports={
    validateWatchlist,
    validateWatchlistUpdate,
    validatePagination,
    validateWatchlistId
};