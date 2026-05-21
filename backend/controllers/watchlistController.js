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
        const {status, type, favorite, title, page=1, limit=10} = req.query;

        const filter = {
            user: req.user.id,
        };

        //Filter by title ("title" query)
        if(title) {
            filter.title = {
                $regex: title,
                $options: 'i' //makes it case insensitive
            };
        }

        //Filter by status
        if(status) filter.status=status;

        //Filter by type
        if(type) filter.type=type;

        //Filter by favorite
        if(favorite) filter.favorite=favorite;

        //Number of records to be skipped
        const skip=(page-1)*limit; 

        //sorting
        const items=await Watchlist.find(filter)
        .sort({createdAt: -1})
        .skip(skip)
        .limit(Number(limit));

        res.json({
            page: Number(page),
            limit: Number(limit),
            count: items.length,
            items,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

//Getting a single watchlist Item
const getWatchlistItem = async (req,res) => {
    try {
        const item = await Watchlist.findOne({
            _id:req.params.id,
            user: req.user.id
        });

        if(!item) {
            return res.status(404).json({
                message: 'Watchlist item not found'
            });
        }

        res.json(item);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//UPDATE
const updateWatchlist = async (req, res) => {
    try {
        const item = await Watchlist.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!item) {
            return res.status(404).json({
                message: 'Watchlist item not found'
            });
        }

        Object.assign(item, req.body);

        await item.save();

        res.json(item);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

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

//Watchlist stats
const getWatchlistStats = async (req,res) => {
    try {
        const userId=req.user.id;

        const total = await Watchlist.countDocuments({
            user: userId
        });

        const watching = await Watchlist.countDocuments({
            user:userId,
            status: 'watching',
        })

        const completed = await Watchlist.countDocuments({
            user:userId,
            status: 'completed',
        })

        const planned = await Watchlist.countDocuments({
            user:userId,
            status: 'planned',
        })

        const favorites = await Watchlist.countDocuments({
            user:userId,
            favorite: true,
        })

        const avgRatingResult = await Watchlist.aggregate([
            {
                $match: {
                    user: req.user.id,
                    rating: { $ne: null }
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: {
                        $avg: '$rating'
                    }
                }
            },
        ]);

    const averageRating =
      avgRatingResult[0]?.averageRating || 0;

      res.json({
      total,
      watching,
      completed,
      planned,
      favorites,
      averageRating: Number(
        averageRating.toFixed(1)
      )
    });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    } 

    
}

//Update progress for series
const updateProgress = async (req,res) => {
    try {
        const { id }=req.params;
        const { season, episode}=req.body;

        const item = await Watchlist.findOne({
            _id:id,
            user: req.user.id
        });

        if(!item) {
            return res.status(400).json({
                message: 'Watchlist item not found'
            });
        }

        if(season !==undefined) {
            item.progress.season = season;
        }

        if(episode !==undefined) {
            item.progress.episode = episode;
        }

        //minutesWatched not in the watchlist schema
        // if(minutesWatched !==undefined) {
        //     item.progress.minutesWatched = minutesWatched;
        // }

        await item.save();

        res.json(item);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
module.exports = {
    addToWatchlist,
    getWatchlist,
    getWatchlistItem,
    updateWatchlist, 
    deleteWatchlist, 
    addFromOmdb, 
    getWatchlistStats,
    updateProgress,
    };