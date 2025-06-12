const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

function connectWithRetry() {
  mongoose
    .connect("mongodb://localhost:27017/pomodoro", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      console.log("Retrying connection in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    });
}

connectWithRetry();

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected! Attempting to reconnect...");
  connectWithRetry();
});

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
    process.exit(1);
  }
});

const sessionRoutes = require("./routes/sessions");
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
