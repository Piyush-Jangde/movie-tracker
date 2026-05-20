const express = require('express');
const router = express.Router();

const auth=require('../middleware/authMiddleware');

const {
    addToWatchlist,
    getWatchlist,
    updateWatchlist,
    deleteWatchlist
} = require('../controllers/watchlistController');

router.use(auth);

router.post('/', addToWatchlist);
router.get('/', getWatchlist);
router.put('/:id', updateWatchlist);
router.delete('/:id', deleteWatchlist);

module.exports = router;