const mongoose  = require("mongoose");

const watchlistSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['movie', 'series'],
            required: true,
        },
        status: {
            type: String,
            enum: ['planned', 'watching', 'completed'],
            default: 'planned',
        },
        progress: {
            season: {
                type: Number,
                default: 1,
            },
            episode: {
                type: Number,
                default: 0,
            },
        },
        rating: {
            type: Number,
            min: 1,
            max: 10,
        },
        notes: {
            type: String,
            maxLength: 500,
        },
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model('Watchlist', watchlistSchema);