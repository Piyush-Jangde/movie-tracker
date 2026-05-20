const Watchlist = require("../models/Watchlist");

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
module.exports = {addToWatchlist, getWatchlist, updateWatchlist, deleteWatchlist};