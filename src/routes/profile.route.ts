import express = require("express");
import type { Request, Response } from "express";
import type { AuthRequest, UpdateUserRequest } from "../utils/types";
const { userAuth } = require("../middleware/auth.middleware");
const User = require("../models/user.model");
const { validateProfileEditData } = require("../utils/validation");
import type userType = require("../models/user.type");

const profileRouter = express.Router();

// #region View
profileRouter.get(
  "/profile/view",
  userAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user;

      if (!user) {
        res.status(404).send("User not found");
      } else {
        res.send(user);
      }
    } catch (err) {
      res.status(404).send("Something went wrong");
    }
  }
);
// #endregion

// #region Edit
profileRouter.patch(
  "/profile/edit",
  userAuth,
  async (req: UpdateUserRequest, res: Response) => {
    try {
      if (!validateProfileEditData(req.body)) {
        throw new Error("Invalid Edit Request");
      }

      const user = req.user;

      Object.keys(req.body).forEach((field) => {
        (user as any)[field] = req.body[field as keyof typeof req.body];
      });

      const updatedUser = await user?.save();

      res.json({
        message: `${user?.firstName}'s Profile Updated Successfully`,
        payload: updatedUser,
      });
    } catch (err: any) {
      res.status(401).json("ERROR: " + err.message);
    }
  }
);
// #endregion

module.exports = profileRouter;
