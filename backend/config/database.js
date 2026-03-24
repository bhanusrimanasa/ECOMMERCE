const mongoose = require("mongoose");

const connectDatabase = () => {
  // Directly using the connection string to bypass environment variable issues
  const DB_URI = "mongodb+srv://bhanusrimanasa_db_user:crack1309@cluster0.gk1zjyt.mongodb.net/myShop?retryWrites=true&w=majority";

  mongoose
    .connect(DB_URI) // Modern Mongoose handles connections automatically without extra options
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.log("Database connection failed. Error:", err.message);
    });
};

module.exports = connectDatabase;