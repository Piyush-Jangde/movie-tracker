import { useEffect, useState } from "react";
import api from "../services/api";


function Watchlist() {
    const [watchlist,setWatchlist]=useState([]);
    const [searchTitle,setSearchTitle]=useState("");
    const [statusFilter,setStatusFilter]=useState("");
    const [sortBy,setSortBy]=useState("recent");

    //gets the User's last saved watchlist when the page is loaded
    useEffect(()=>{
        fetchWatchlist()
    },[]);


    async function fetchWatchlist() {
        try {
            const params = {};

            if (searchTitle) {
            params.title = searchTitle;
            }

            if (statusFilter) {
            params.status = statusFilter;
            }

            const response = await api.get(
            "/watchlist",
            { params }
            );

            setWatchlist(response.data.items);

        } catch (error) {
            console.log(
            error.response?.data || error.message
            );
        }
    }

    async function handleDelete(id) {
        try {
            //deletes from backend i.e. DB
            await api.delete(`/watchlist/${id}`);

            //update UI
            setWatchlist(
                watchlist.filter(
                    (item)=> item._id !== id
                )
            );
            alert("Removed from watchlist");
        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        }
    }

    async function handleStatusChange(id,newStatus) {
        try {
            //sending PUT req to update on backend
            await api.put(
                `/watchlist/${id}`,
                {
                    status: newStatus,
                }
            );

           setWatchlist((prevWatchlist) =>
                prevWatchlist.map((item) =>
                    item._id === id
                    ? {
                        ...item,
                        status: newStatus,
                        }
                    : item
                )
            );
        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        }
    }

    async function handleRatingChange(id,newRating) {
        try {
            //sending PUT req to update on backend
            await api.put(
                `/watchlist/${id}`,
                {
                    rating: Number(newRating),
                }
            );

            setWatchlist((prevWatchlist) =>
                prevWatchlist.map((item) =>
                    item._id === id
                    ? {
                        ...item,
                        rating: Number(newRating),
                        }
                    : item
                )
            );
        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        }
    }

    const sortedWatchlist = [...watchlist].sort((a, b) => {
    if (sortBy === "title") {
        return a.title.localeCompare(b.title);
    }

    if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
    }

    return 0; // recent (backend already sorted)
    });

    const hasActiveFilter=searchTitle||statusFilter;
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
            My Watchlist
            </h1>

            {/* Search + Filter + Sort Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
            
            <form
                onSubmit={(e) => {
                e.preventDefault();
                fetchWatchlist();
                }}
                className="flex gap-3 flex-1"
            >
                <input
                type="text"
                placeholder="Search your watchlist..."
                value={searchTitle}
                onChange={(e) =>
                    setSearchTitle(e.target.value)
                }
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                type="submit"
                className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                Search
                </button>
            </form>

            <select
                value={statusFilter}
                onChange={(e) =>
                setStatusFilter(e.target.value)
                }
                className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
            >
                <option value="">
                All Statuses
                </option>
                <option value="planned">
                Planned
                </option>
                <option value="watching">
                Watching
                </option>
                <option value="completed">
                Completed
                </option>
            </select>

            <button
                onClick={fetchWatchlist}
                className="bg-purple-600 px-5 py-2 rounded-lg hover:bg-purple-700"
            >
                Apply
            </button>

            <select
                value={sortBy}
                onChange={(e) =>
                setSortBy(e.target.value)
                }
                className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
            >
                <option value="recent">
                Recently Added
                </option>
                <option value="title">
                Title (A-Z)
                </option>
                <option value="rating">
                Rating (High-Low)
                </option>
            </select>
            </div>

            <p className="mb-6 text-gray-300">
            Total items: {watchlist.length}
            </p>

            {watchlist.length === 0 && (
                <p className="text-gray-400 mb-6">
                    {
                        hasActiveFilter
                        ? "No movies match your current filters."
                        : "Your watchlist is empty."
                    }
                </p>
            )}

            {/* Watchlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedWatchlist.map((item) => (
                <div
                key={item._id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                >
                <img
                    src={item.posterPath}
                    alt={item.title}
                    className="w-full h-80 object-cover"
                />

                <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">
                    {item.title}
                    </h3>

                    <p className="text-gray-400 text-sm">
                    {item.releaseYear}
                    </p>

                    <p className="text-gray-400 text-sm mb-4 capitalize">
                    {item.type}
                    </p>

                    <select
                    value={item.status}
                    onChange={(e) =>
                        handleStatusChange(
                        item._id,
                        e.target.value
                        )
                    }
                    className="w-full mb-3 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600"
                    >
                    <option value="planned">
                        Planned
                    </option>
                    <option value="watching">
                        Watching
                    </option>
                    <option value="completed">
                        Completed
                    </option>
                    </select>

                    <select
                    value={item.rating || ""}
                    onChange={(e) =>
                        handleRatingChange(
                        item._id,
                        e.target.value
                        )
                    }
                    className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600"
                    >
                    <option value="">
                        No rating
                    </option>

                    {[1,2,3,4,5,6,7,8,9,10].map(
                        (num) => (
                        <option
                            key={num}
                            value={num}
                        >
                            Rating: {num}
                        </option>
                        )
                    )}
                    </select>

                    <button
                    onClick={() =>
                        handleDelete(item._id)
                    }
                    className="w-full bg-red-600 py-2 rounded-lg hover:bg-red-700"
                    >
                    Remove
                    </button>
                </div>
                </div>
            ))}
            </div>
        </div>
    );
}

export default Watchlist;