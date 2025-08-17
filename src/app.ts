import express = require("express");
const connectDB = require("./config/database");
import cookieParser = require("cookie-parser");

// Importing routes
const authRouter = require("./routes/auth.route");
const profileRouter = require("./routes/profile.route");
const requestRouter = require("./routes/request.route");

const app = express();
// MIDDLEWARE - read request and response in the form of json for all the routes
app.use(express.json());
// MIDDLEWARE - Use cookie-parser middleware
app.use(cookieParser());

// Enabling the routes via middlewares
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

(async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB ✅");

    app.listen(8000, () => {
      console.log("Server is up and running 🚀");
    });
  } catch (error) {
    console.error("Couldn't connect to the Database ❌", error);
  }
})();
