const axios=require("axios");

const searchMovies = async (req,res) => {
    try {
        const query=req.query.q;

        const response = await axios.get(
            `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${query}`
        );
        
        const data=response.data;

        if(data.Response === 'False') {
            return res.status(404).json({
                message:data.error
            });
        }

        const cleanedResults=data.Search.map((item)=> ({
            imdbId: item.imdbId,
            title: item.Title,
            type: item.Type,
            posterPath: item.Poster,
            releaseYear: item.Year
        }));

        res.json(cleanedResults);

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching data from OMDb'
        });
    }
}

const getMovieDetails = async (req,res) => {
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


        console.log(data);
        const cleanedData = {
            imdbId: data.imdbId,
            title: data.Title,
            type: data.Type,
            posterPath: data.Poster,
            overview: data.Plot,
            releaseYear: data.Year,
            genres: data.Genre ? data.Genre.split(', ') : [],
            language: data.Language,
            runtime: data.Runtime,
            totalSeasons: data.totalSeasons ? Number(data.totalSeasons):null,
            rating: data.imdbRating,
        };

        res.json(cleanedData);

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            message: 'Error fetching movie details from OMDb'
        });
    }
}

module.exports={searchMovies, getMovieDetails};