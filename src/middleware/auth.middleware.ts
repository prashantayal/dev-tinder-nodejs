import type { NextFunction, Response } from "express";
import type { AuthRequest, MyJwtPayload } from "../utils/types";
import jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const userAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Read the token from the request cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token not found");
    }

    // Validate the token
    const decodedJWT = jwt.verify(token, "B2.2355.vk") as MyJwtPayload;
    const { _id } = decodedJWT;
    if (!_id) {
      throw new Error("Invalid token");
    }

    // Find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).send("ERROR: " + err.message);
    } else {
      res.status(400).send("Authentication Error");
    }
  }
};

module.exports = { userAuth };
