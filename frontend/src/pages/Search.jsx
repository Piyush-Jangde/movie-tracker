import { useState } from "react";
import api from "../services/api";

function Search() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

  async function handleSearch(e) {
    e.preventDefault();

    try {
      const response = await api.get(
        `/omdb/search?q=${query}`
      );

      console.log(response.data);

      setMovies(response.data);
    } catch (error) {
      console.log(
        error.response?.data || error.message
      );
    }
  }

  console.log("movies state:", movies);

  async function handleAddToWatchlist(movie) {
    try {
        const response = await api.post(
            "/watchlist ",
            {
                title: movie.title,
                type: movie.type,
                imdbId: movie.imdbId,
                posterPath: movie.posterPath,
                releaseYear: movie.releaseYear,
            }
        );

        console.log("Added:",response.data);
    } catch (error) {
        console.log(
            error.response?.data || error.message
        );
    }
  }

  return (
    <div>
      <h1>Search Movies</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
        />

        <button type="submit">
          Search
        </button>
      </form>

      {<p>Movies found: {movies.length}</p> }

      {movies.length > 0 &&
        movies.map((movie) => (
          <div key={movie.imdbId}>
            <img
              src={movie.posterPath}
              alt={movie.title}
              width="100"
            />

            <h3>{movie.title}</h3>

            <p>{movie.releaseYear}</p>

            <p>{movie.type}</p>

            <button
                onClick={()=>{
                    handleAddToWatchlist(movie)
                }}
            >
                Add to Watchlist
            </button>
          </div>
        ))}
    </div>
  );
}

export default Search;