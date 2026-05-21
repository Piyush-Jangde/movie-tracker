const mongoose  = require("mongoose");

const watchlistSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        //Movies/ Series meta data (to be fetched by TMDb API)

        title: { //can be done manually or fetched by API
            type: String,
            required: true,
            trim: true,
        },
        type: { //can be done manually or fetched by API
            type: String,
            enum: ['movie', 'series'],
            required: true,
        },

        imdbId: {
            type: String,
        },
        posterPath: {
            type: String,
        },
        backdropPath: {
            type: String,
        },
        overview: {
            type: String,
        },
        releaseYear: {
            type: String,
        },
        genre: [
            {
                type: String,
            },
        ],
        language: {
            type: String,
        },

        //for movies
        runtime: {
            type: String,
        },

        //for series
        totalSeasons: {
            type: Number,
        },
        totalEpisodes: {
            type: Number,
        },

        //User given data
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
        favorite: {
            type: Boolean,
            default: false,
        },
        notes: {
            type: String,
            maxLength: 500,
        },

        // optional dates
        startedAt: {
            type: Date,
        },
        completedAt: {
            type: Date,
        },
    },
    {
        timestamps:true
    }
);

watchlistSchema.index(
    {
        user: 1,
        imdbId:1,
    },
    {
        unique:true,
    }
);

module.exports = mongoose.model('Watchlist', watchlistSchema);