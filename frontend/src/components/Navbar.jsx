import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">Home </Link>
      <Link to="/search">Search </Link>

      {user ? (
        <>
          <Link to="/watchlist">Watchlist </Link>

          <button onClick={logout}>
            Logout  
          </button>

          <span>
             {user.username}
          </span>
        </>
      ) : (
        <>
          <Link to="/login">Login </Link>
          <Link to="/register">Register </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;