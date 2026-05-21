const express=require("express");
const router=express.Router();

const protect = require('../middleware/authMiddleware');

const {searchMovies,getMovieDetails}=require("../controllers/omdbController");

router.get('/search',protect,searchMovies);
router.get('/details/:imdbId',protect,getMovieDetails);

module.exports=router;

