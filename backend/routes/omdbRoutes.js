const express=require("express");
const router=express.Router();

const protect = require('../middleware/authMiddleware');

const {searchMovies}=require("../controllers/omdbController");

router.get('/search',protect,searchMovies);

module.exports=router;

