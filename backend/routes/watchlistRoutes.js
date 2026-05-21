const express = require('express');
const router = express.Router();

const auth=require('../middleware/authMiddleware');
const {validateWatchlist,validateWatchlistUpdate}=require('../middleware/validationMiddleware');
const {
    addToWatchlist,
    getWatchlist,
    updateWatchlist,
    deleteWatchlist,
    addFromOmdb,
    getWatchlistStats,
    updateProgress,
} = require('../controllers/watchlistController');



router.use(auth);

router.post('/',validateWatchlist, addToWatchlist);
router.get('/', getWatchlist);
router.get('/stats',getWatchlistStats)
router.patch('/:id/progress',updateProgress);
router.put('/:id',validateWatchlistUpdate, updateWatchlist);
router.delete('/:id', deleteWatchlist);
router.post('/from-omdb/:imdbId',addFromOmdb);

module.exports = router;