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
            imdbId: item.imdbID,
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

module.exports={searchMovies};