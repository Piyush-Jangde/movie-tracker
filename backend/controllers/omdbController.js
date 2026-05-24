const axios=require("axios");

const searchMovies = async (req,res,next) => {
    try {
        const query=req.query.q;
        const type=req.query.type;

        let url=`http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${query}`;

        if(type) {
            url += `&type=${type}`;
        }

        const response = await axios.get(url); 
        
        const data=response.data;

        if(data.Response === 'False') {
            return res.status(404).json({
                message:data.Error
            });
        }

        const cleanedResults=data.Search.map((item)=> ({
            imdbId: item.imdbID,
            title: item.Title,
            type: item.Type,
            posterPath: item.Poster,
            releaseYear: item.Year
        }));

        res.json(cleanedResults);

    } catch (error) {
        next(error);
    }
}

const getMovieDetails = async (req,res,next) => {
    try {
        const imdbId=req.params.imdbId;

        const response = await axios.get(
            `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${imdbId}`
        );

        const data=response.data;

        if(data.Response === 'False') {
            return res.status(404).json({
                message:data.Error
            });
        }


        console.log(data);
        const cleanedData = {
            imdbId: data.imdbID,
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
        next(error);
    }
}

module.exports={searchMovies, getMovieDetails};