import express = require("express");
import type { Request, Response } from "express";
import type { SignupRequest } from "../utils/types";
const { validateSignupData } = require("../utils/validation");
import bcrypt = require("bcrypt");
const User = require("../models/user.model");

const authRouter = express.Router();

// #region Signup
authRouter.post("/signup", async (req: SignupRequest, res: Response) => {
  try {
    // Validate the incoming data
    validateSignupData(req);

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Store into DB (with hashed password)
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

// #region Login
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { emailID, password } = req.body;

    const foundUser = await User.findOne({ emailID: emailID }).select(
      "+password"
    );

    if (!foundUser) {
      res.status(404).send("User not found");
    } else {
      const isPasswordValid = await foundUser.checkPassword(password);

      if (isPasswordValid) {
        const user = foundUser.toObject();
        delete user.password;

        // get new JWT token created in userSchema
        const token = foundUser.getJWT();
        // add token to the cookie
        res.cookie("token", token);

        res.send(user);
      } else {
        res.status(404).send("Not Authorised");
      }
    }
  } catch (err: any) {
    res.status(404).send("Login Error: " + err.message);
  }
});

// #region Logout
authRouter.post("/logout", async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.send("Logged out successfully");
});

module.exports = authRouter;
