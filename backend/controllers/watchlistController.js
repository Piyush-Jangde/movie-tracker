const Watchlist = require("../models/Watchlist");
const axios=require('axios');
const mongoose=require('mongoose');

//CREATE
const addToWatchlist = async (req,res,next) => {
    try {
        const item = await Watchlist.create({
            ...req.body,
            user: req.user.id,
        });

        res.status(201).json(item);
    } catch (error) {
        next(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};
 
//READ (fetches the whole collection)
const getWatchlist = async (req,res,next)=>{
    try {
        const {status, type, favorite, title, page=1, limit=10} = req.query;

        const pageNum=Number(page);
        const limitNum=Number(limit);
        //Number of records to be skipped
        const skip=(pageNum-1)*limitNum;

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
        if (favorite !== undefined) {
           filter.favorite = favorite === 'true';
        }

        ; 

        const totalItems= await Watchlist.countDocuments(filter);
        //sorting
        const items=await Watchlist.find(filter)
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limitNum);

        const totalPages= Math.ceil(totalItems/limitNum);

        const hasNextPage = pageNum < totalPages;
        const hasPrevPage = pageNum >1;

        res.json({
            page: Number(page),
            limit: Number(limit),
            count: items.length,
            totalItems,
            totalPages,
            hasNextPage,
            hasPrevPage,
            items,
        });
    } catch (error) {
        next(error);
    }
}

//Getting a single watchlist Item
const getWatchlistItem = async (req,res,next) => {
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
        next(error);
    }
};

//UPDATE
const updateWatchlist = async (req, res,next) => {
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

        res.json({item});

    } catch (error) {
        next(error);
    }
};

//DELETE
const deleteWatchlist = async (req,res,next)=>{
    try {
        const item = await Watchlist.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        if(!item) {
            return res.status(404).json({
                message: "Watchlist item not found"
            });
        }

        res.json({
            message: "Deleted Successfully"
        });
    } catch (error) {
        next(error);
    }
}

//Fetching from omdb and saving in mongoDB
const addFromOmdb = async (req,res,next) => {
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
        if (error.code === 11000) {
            error.statusCode = 400;
            error.message = 'This title is already in your watchlist';
        }
        next(error);
    }
}

//Watchlist stats
const getWatchlistStats = async (req,res,next) => {
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
                    user: new mongoose.Types.ObjectId(req.user.id),
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
        next(error);
    } 

    
}

//Update progress for series
const updateProgress = async (req,res,next) => {
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
        if (item.type !== 'series') {
            return res.status(400).json({
                message: 'Progress can only be updated for series'
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

        res.json({
            progress: item.progress
        });
    } catch (error) {
        next(error);
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