import express = require("express");
import type { Response } from "express";
import mongoose = require("mongoose");

import type { AuthRequest } from "../utils/types";
const { userAuth } = require("../middleware/auth.middleware");
const ConnectionRequest = require("../models/connectionRequest.model");
const User = require("../models/user.model");

const requestRouter = express.Router();

// #region Send Request
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
      res.json({
        message: `Connection ${status.toUpperCase()} Sent Successfully`,
        data,
      });
    } catch (err: any) {
      res.status(400).json({
        error: err.message,
      });
    }
  }
);

// #region Request Review
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status ?? "")) {
        return res.status(400).json({
          message: "Inavlid status: Should be either accepted or rejected",
        });
      }

      const connectRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser?._id,
        status: "interested",
      });

      if (!connectRequest) {
        return res.status(400).json({
          message: "Connection request not found!",
        });
      }

      connectRequest.status = status;

      const data = await connectRequest.save();

      res.json({
        message: "Connection Request " + status?.toLocaleUpperCase(),
        data,
      });
    } catch (err: any) {
      res.status(400).json({
        message: err.message,
      });
    }
  }
);

module.exports = requestRouter;
