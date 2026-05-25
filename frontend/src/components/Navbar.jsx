import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        <Link
          to="/"
          className="text-xl font-bold hover:text-gray-300"
        >
          Movie Tracker
        </Link>

        <div className="flex items-center gap-6">

          {user ? (
            <>
              <Link
                to="/search"
                className="hover:text-gray-300"
              >
                Search
              </Link>
              <Link
                to="/watchlist"
                className="hover:text-gray-300"
              >
                Watchlist
              </Link>

              <span className="text-sm text-gray-300">
                {user.username}
              </span>

              <button
                onClick={logout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-gray-300"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
              >
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;