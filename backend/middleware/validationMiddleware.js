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


const validateRegister = [
    body('username')
        .notEmpty()
        .withMessage('Username is required'),
    body('email')
        .isEmail()
        .withMessage('Valid email is required'),
    body('password')
        .isLength({min:8})
        .withMessage('Password must at least have 8 characters'),

    validationMiddleware
]

const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Valid email is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    validationMiddleware
]



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



const validateWatchlistQuery = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Limit must be a positive integer'),
    query('status')
        .optional()
        .isIn(['watching','completed','planned'])
        .withMessage('Invalid Status. Status must be watching, completed or planned'),
    query('type')
        .optional()
        .isIn(['series','movie'])
        .withMessage('Type must be movie or series'),
    query('favorite')
        .optional()
        .isBoolean()
        .withMessage('Favorite must be true or false'),

    validationMiddleware
];

const validateProgressUpdate = [
    body('season')
        .optional()
        .isInt({min:1})
        .withMessage('Season must be a positive integer'),
    body('episode')
        .optional()
        .isInt({min:0})
        .withMessage('Episode must be 0 or greater'),

    validationMiddleware
]



module.exports={
    validateRegister,
    validateLogin,
    validateWatchlist,
    validateWatchlistUpdate,
    validateWatchlistQuery,
    validateWatchlistId,
    validateProgressUpdate,
};