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

            console.log(response.data);

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

    return (
        <div >
            <h1>My Watchlist</h1>
            {/* Search/filter by title */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    fetchWatchlist();
                }}
            >
                <input
                    type="text"
                    placeholder="Search your watchlist..."
                    value={searchTitle}
                    onChange={(e) =>
                    setSearchTitle(e.target.value)
                    }
                />

                <button type="submit">
                    Search
                </button>
            </form>

            {/* Filter by status */}
            <select
                value={statusFilter}
                onChange={(e) => {
                    setStatusFilter(e.target.value);
                }}
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

            <button onClick={fetchWatchlist}>
            Apply Filter
            </button>

            {/* Sort */}
            <select
                value={sortBy}
                onChange={(e) =>
                    setSortBy(e.target.value)
                }
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

            <p>Total items: {watchlist.length}</p>

            {sortedWatchlist.map((item)=>(
                <div key={item._id}>
                    <img
                        src={item.posterPath}
                        alt={item.title}
                        width="100"
                    />

                    <h3>{item.title}</h3>
                    <p>{item.releaseYear}</p>
                    <p>{item.type}</p>
                    <select
                        value={item.status}
                        onChange={(e) =>
                            handleStatusChange(
                            item._id,
                            e.target.value
                            )
                        }
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
                    <label htmlFor={`rating-${item._id}`}>
                        Rating:
                    </label>
                    <select
                        id={`rating-${item._id}`}
                        value={item.rating || ""}
                        onChange={(e) =>
                            handleRatingChange(
                            item._id,
                            e.target.value
                            )
                        }
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
                                {num}
                            </option>
                            )
                        )}
                        </select>

                    <button
                        onClick={()=>
                            handleDelete(item._id)
                        }>
                            Remove
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Watchlist;