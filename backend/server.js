const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler=require("./middleware/errorMiddleware");

const app = express();


connectDB();

app.use(cors({
  origin: [ 
    process.env.CLIENT_URL,
    "http://localhost:5173"
  ]
}));
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("Movie Tracker API running")
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/watchlist", require("./routes/watchlistRoutes"));
app.use("/api/omdb", require("./routes/omdbRoutes"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});