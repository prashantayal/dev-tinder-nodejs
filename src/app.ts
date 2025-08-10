const express = require("express");
const connectDB = require("./config/database");
import type { Request, Response } from "express";
const UserModel = require("./models/userModel");

const app = express();

// MIDDLEWARE - read request and response in the form of json for all the routes
app.use(express.json());

app.post("/signup", async (req: Request, res: Response) => {
  // Creating a new instance of the UserModel
  const user = new UserModel(req.body);

  try {
    await user.save();
    res.send("User Added Successfully");
  } catch (err: any) {
    res.status(400).send("Error saving the user" + err.message);
  }
});

(async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    app.listen(8000, () => {
      console.log("Server is up and running...");
    });
  } catch (error) {
    console.error("Couldn't connect to the Database", error);
  }
})();
