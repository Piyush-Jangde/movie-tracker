import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="text-center mt-20">
      <h1 className="text-5xl font-bold mb-6">
        Movie Tracker
      </h1>

      <p className="text-xl text-gray-300 mb-10">
        Track movies and TV shows you want to watch,
        are watching, or have completed.
      </p>

      {user ? (
        <div className="flex justify-center gap-4">
          <Link
            to="/search"
            className="bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Search Movies
          </Link>

          <Link
            to="/watchlist"
            className="bg-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            View Watchlist
          </Link>
        </div>
      ) : (
        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Create Account
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;