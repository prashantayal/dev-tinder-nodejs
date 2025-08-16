const express = require("express");
const connectDB = require("./config/database");
import type { Request, Response } from "express";
import type {
  SignupRequest,
  UpdateUserRequest,
  MyJwtPayload,
} from "./utils/interfaces";
const User = require("./models/user.model");
import bcrypt = require("bcrypt");
const { validateSignupData } = require("./utils/validation");
import jwt = require("jsonwebtoken");
import cookieParser = require("cookie-parser");

const app = express();

// MIDDLEWARE - read request and response in the form of json for all the routes
app.use(express.json());
// Use cookie-parser middleware
app.use(cookieParser());

// Signup user
app.post("/signup", async (req: SignupRequest, res: Response) => {
  try {
    // 1. Validate the incoming data
    validateSignupData(req);

    // 2. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // 3. Store into DB (with hashed password)
    const user = new User({
      ...req.body,
      password: hashedPassword,
    });

    await user.save();

    res.send("User Added Successfully");
  } catch (err: any) {
    res.status(400).send(`ERROR: ${err.message}`);
  }
});

// Login user
app.post("/login", async (req: Request, res: Response) => {
  try {
    const { emailID, password } = req.body;

    const user = await User.findOne({ emailID: emailID }).select("+password");

    if (!user) {
      res.status(404).send("User not found");
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        // create JWT token
        const token = jwt.sign({ _id: user._id }, "B2.2355.vk");
        // add token to the cookie
        res.cookie("token", token);

        res.send(userWithoutPassword);
      } else {
        res.status(404).send("Not Authorised");
      }
    }
  } catch (err: any) {
    res.status(404).send("Login Error: " + err.message);
  }
});

// Get profile data
app.get("/profile", async (req: Request, res: Response) => {
  const { token } = req.cookies;
  const decodedToken = jwt.verify(token, "B2.2355.vk") as MyJwtPayload;
  console.log("user id:", decodedToken._id);

  try {
    const user = await User.findById(decodedToken._id);

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

// Get all users
app.get("/feed", async (req: Request, res: Response) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      res.status(404).send("Users not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

// Update user
app.patch("/user/:id", async (req: UpdateUserRequest, res: Response) => {
  const id = req.params?.id;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age"];

    const isUpdateAllowed = Object.keys(req.body).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      res.status(404).send("Update not Allowed");
    }

    await User.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.send("User Updated Successfully");
  } catch (err: any) {
    res.status(404).send("Something went wrong " + err.message);
  }
});

// Delete user
app.delete("/user/:id", async (req: Request, res: Response) => {
  const id = req.params?.id;

  try {
    await User.findByIdAndDelete(id);
    res.send("User Deleted Successfully");
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

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
