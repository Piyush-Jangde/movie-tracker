const Watchlist = require("../models/Watchlist");
const axios=require('axios');

//CREATE
const addToWatchlist = async (req,res) => {
    try {
        const item = await Watchlist.create({
            ...req.body,
            user: req.user.id,
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//READ
const getWatchlist = async (req,res)=>{
    try {
        const filter = {
            user: req.user.id,
        };

        //Filter by status
        if(req.query.status) {
            filter.status=req.query.status;
        }

        //Filter by type
        if(req.query.type) {
            filter.type=req.query.type;
        }

        //Filter by favorite
        if(req.query.favorite) {
            filter.favorite=req.query.favorite === "true";
        }

        const items=await Watchlist.find(filter).sort({
            createdAt: -1
        });

        res.json(items);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

//UPDATE
const updateWatchlist = async (req,res)=>{
    try {
        const item = await Watchlist.findOneAndUpdate({
            _id: req.params.id,
            user: req.user.id,
        }, 
        req.body,
        {new:true}
    );

        res.json(item);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

//DELETE
const deleteWatchlist = async (req,res)=>{
    try {
        const item = await Watchlist.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        res.json({
            message: "Deleted Successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

//Fetching from omdb and saving in mongoDB
const addFromOmdb = async (req,res) => {
    try {
        const imdbId=req.params.imdbId;

        const response = await axios.get(
            `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${imdbId}`
        );

        const data=response.data;

        if(data.Response === 'False') {
            return res.status(404).json({
                message:data.error
            });
        }

        const watchlistItem = await Watchlist.create({
            user: req.user._id,
            title: data.Title,
            type: data.Type,
            imdbId: data.imdbID,
            posterPath: data.Poster,
            overview: data.Plot,
            releaseYear: data.Year,
            genres: data.Genre ? data.Genre.split(', '):[],
            language: data.Language,
            runtime: data.Runtime,
            totalSeasons: data.totalSeasons ? Number(data.totalSeasons):null,
        });

        res.status(201).json(watchlistItem);

    } catch (error) {

        console.log(error.message);

        if (error.code === 11000) {
            return res.status(400).json({
                message: 'This title is already in your watchlist'
            });
        }

        res.status(500).json({
            message: 'Error saving movie from OMDb'
        });
    }
}
module.exports = {addToWatchlist, getWatchlist, updateWatchlist, deleteWatchlist, addFromOmdb};