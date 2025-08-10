const express = require("express");
const connectDB = require("./config/database");
import type { Request, Response } from "express";
const UserModel = require("./models/userModel");

interface SignupRequest extends Request {
  body: {
    firstName: string;
    lastName: string;
    emailID: string;
    password: string;
  };
}

const app = express();

// MIDDLEWARE - read request and response in the form of json for all the routes
app.use(express.json());

// Get a user data
app.get("/user", async (req: Request, res: Response) => {
  const userEmail = req.body.emailID;

  try {
    const users = await UserModel.find({ emailID: userEmail });

    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users[0]);
    }
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

// Get all users
app.get("/feed", async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find({});

    if (users.length === 0) {
      res.status(404).send("Users not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

// Delete user
app.delete("/user", async (req: Request, res: Response) => {
  try {
    const id = req.body.userID;
    const user = await UserModel.findById(id);

    if (!user) {
      res.status(404).send("User not found!");
    } else {
      await UserModel.findByIdAndDelete(id);
      res.send("User Deleted Successfully");
    }
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

// Signup user
app.post("/signup", async (req: SignupRequest, res: Response) => {
  const { firstName, lastName, emailID, password } = req.body;

  if (!firstName || !lastName || !emailID || !password) {
    return res.status(400).send("All fields are required.");
  }

  try {
    const existingUser = await UserModel.findOne({ emailID: emailID });

    if (existingUser) {
      res.status(401).send("Cannot Signup, email ID is already taken");
    } else {
      const user = new UserModel(req.body);

      await user.save();
      res.send("User Added Successfully");
    }
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
