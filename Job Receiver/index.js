require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const morgan = require("morgan");

const cors = require("cors");

const app = express();
// Connect to Database
const { connectDB } = require("./config/db");
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

// Routes
app.use("/api/v1", require("./routes/index"));

const PORT = 8000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
