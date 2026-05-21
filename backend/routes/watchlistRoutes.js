const express = require('express');
const router = express.Router();

const auth=require('../middleware/authMiddleware');
const {
    validateWatchlist,
    validateWatchlistUpdate,
    validatePagination,
    validateWatchlistId
} = require('../middleware/validationMiddleware');
const {
    addToWatchlist,
    getWatchlist,
    getWatchlistItem,
    updateWatchlist,
    deleteWatchlist,
    addFromOmdb,
    getWatchlistStats,
    updateProgress,
} = require('../controllers/watchlistController');



router.use(auth);

router.post('/',validateWatchlist, addToWatchlist);

router.get('/', validatePagination, getWatchlist);
router.get('/stats',getWatchlistStats);
router.get('/:id',validateWatchlistId,getWatchlistItem);

router.patch('/:id/progress',validateWatchlistId,updateProgress);

router.put('/:id',validateWatchlistId,validateWatchlistUpdate, updateWatchlist);

router.delete('/:id',validateWatchlistId ,deleteWatchlist);

router.post('/from-omdb/:imdbId',addFromOmdb);

module.exports = router;