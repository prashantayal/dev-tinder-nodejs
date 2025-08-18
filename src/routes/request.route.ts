import express = require("express");
import type { Response } from "express";
import mongoose = require("mongoose");

import type { AuthRequest } from "../utils/types";
const { userAuth } = require("../middleware/auth.middleware");
const ConnectionRequest = require("../models/connectionRequest.model");
const User = require("../models/user.model");

const requestRouter = express.Router();

// #region Send request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      const fromUserId = req.user?._id ?? "";
      const toUserId = req.params.toUserId ?? "";
      const status = (req.params.status ?? "").toLowerCase().trim();

      // 1. Validate status
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }

      // 2. Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).json({
          message: "Invalid user id",
        });
      }

      // 3. Check if target user exists
      const userExists = await User.findById(toUserId);
      if (!userExists) {
        return res.status(404).json({
          message: "User does not exist",
        });
      }

      // If all checks pass → create connection request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({ message: "Connection Request Sent Successfully", data });
    } catch (err: any) {
      res.status(400).json({
        error: err.message,
      });
    }
  }
);

module.exports = requestRouter;
