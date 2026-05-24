import { Link } from "react-router-dom";

function Navbar() {
    return(
        <nav className="bg-gray-800 px-6 py-4 flex gap-6 text-white">
            <Link to="/">Home</Link>
            <Link to="/search">Search</Link>
            <Link to="/watchlist">Watchlist</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
        </nav>
    );
}

export default Navbar;