import express = require("express");
import type { Request, Response } from "express";
import type {
  AuthRequest,
  SignupRequest,
  UpdateUserRequest,
} from "../utils/types";
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
// #endregion

// #region Login
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { emailID, password } = req.body;

    const user = await User.findOne({ emailID: emailID }).select("+password");

    if (!user) {
      res.status(404).send("User not found");
    } else {
      const isPasswordValid = user.checkPassword(password);
      if (isPasswordValid) {
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        // get new JWT token created in userSchema
        const token = user.getJWT();
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
// #endregion

// #region Logout
authRouter.post("/logout", async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.send("Logged out successfully");
});
// #endregion

module.exports = authRouter;
