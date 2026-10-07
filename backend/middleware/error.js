const ErrorHander = require("../utils/errorhander");

module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  console.error("ERROR 💥:", err);

  // Wrong MongoDB Id error (Cast Error)
  if (err.name === "CastError") {
    message = `Resource not found. Invalid: ${err.path}`;
    statusCode = 400;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    statusCode = 400;
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    message = `Json Web Token is invalid, Try again`;
    statusCode = 400;
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    message = `Json Web Token is Expired, Try again`;
    statusCode = 400;
  }

  // Cloudinary / Upload errors
  if (err.name === "Error" && message.includes("must supply api_key")) {
    message = "Cloudinary config missing. Please check your config.env file.";
    statusCode = 500;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};