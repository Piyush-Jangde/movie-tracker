const express = require('express');
const router = express.Router();

const auth=require('../middleware/authMiddleware');

const {
    addToWatchlist,
    getWatchlist,
    updateWatchlist,
    deleteWatchlist,
    addFromOmdb,
} = require('../controllers/watchlistController');

router.use(auth);

router.post('/', addToWatchlist);
router.get('/', getWatchlist);
router.put('/:id', updateWatchlist);
router.delete('/:id', deleteWatchlist);
router.post('/from-omdb/:imdbId',addFromOmdb);

module.exports = router;