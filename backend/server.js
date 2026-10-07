const path = require("path");
const app = require("./app");
const cloudinary = require("cloudinary").v2;
const connectDatabase = require("./config/database");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception Error: ${err.message}`);
  console.error(err.stack);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

// Load Config Environment Variables
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: path.join(__dirname, "config", "config.env") });
}

// Connecting to Database
connectDatabase();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fallback to Port 5000 if process.env.PORT is undefined
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Promise Rejection Error: ${err.message}`);
  console.error(err.stack);
  console.log("Shutting down the server due to Unhandled Promise Rejection");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});