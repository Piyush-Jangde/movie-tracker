import { useState, useEffect } from "react";
import api from "../services/api";

function Search() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (hasSearched) {
      fetchMovies();
    }
  }, [page]);

  async function fetchMovies() {
    try {
      const response = await api.get(
        `/omdb/search?q=${query}&page=${page}`
      );

      console.log(response.data);

      setMovies(response.data.items);
    } catch (error) {
      console.log(
        error.response?.data || error.message
      );

      setMovies([]);
    }
  }

  function handleSearch(e) {
    e.preventDefault();

    setPage(1);
    setHasSearched(true);

    fetchMovies();
  }

  async function handleAddToWatchlist(movie) {
    try {
      await api.post("/watchlist", {
        title: movie.title,
        type: movie.type,
        imdbId: movie.imdbId,
        posterPath: movie.posterPath,
        releaseYear: movie.releaseYear,
      });

      alert("Added to watchlist!");
    } catch (error) {
      console.log(
        error.response?.data || error.message
      );
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Search Movies
      </h1>

      <form
        onSubmit={handleSearch}
        className="flex gap-3 mb-8"
      >
        <input
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="bg-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {hasSearched && (
        <p className="mb-6 text-gray-300">
          Movies found: {movies.length}
        </p>
      )}

      {hasSearched && movies.length === 0 && (
        <p className="text-gray-400">
          No movies found.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.imdbId}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={movie.posterPath}
              alt={movie.title}
              className="w-full h-80 object-cover"
            />

            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">
                {movie.title}
              </h3>

              <p className="text-gray-400 text-sm">
                {movie.releaseYear}
              </p>

              <p className="text-gray-400 text-sm mb-4 capitalize">
                {movie.type}
              </p>

              <button
                onClick={() =>
                  handleAddToWatchlist(movie)
                }
                className="w-full bg-green-600 py-2 rounded-lg hover:bg-green-700"
              >
                Add to Watchlist
              </button>
            </div>
          </div>
        ))}
      </div>

      {movies.length > 0 && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() =>
              setPage((prev) =>
                Math.max(prev - 1, 1)
              )
            }
            disabled={page === 1}
            className="bg-gray-700 px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="self-center">
            Page {page}
          </span>

          <button
            onClick={() =>
              setPage((prev) => prev + 1)
            }
            className="bg-blue-600 px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Search;