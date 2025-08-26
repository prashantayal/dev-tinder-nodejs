const express = require("express");

import type { Response } from "express";
import type { AuthRequest } from "../utils/types";
import type userModel = require("../models/user.model");

const { userAuth } = require("../middleware/auth.middleware");
const ConnectionRequest = require("../models/connectionRequest.model");

const userRouter = express.Router();

const USER_METADATA = "firstName lastName gender photoUrl about skills";

// #region Requests Received
userRouter.get(
  "/user/request/received",
  userAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user;

      const requests = await ConnectionRequest.find({
        toUserId: user?._id,
        status: "interested",
      }).populate("fromUserId", USER_METADATA);

      const data = requests.map((item: any) => ({
        connectionId: item._id,
        user: item.fromUserId,
      }));
      res.json({
        success: true,
        message: "Requests data fetched successfully",
        data: data,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
);

// #region Connections
userRouter.get(
  "/user/connections",
  userAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user;

      const connections = await ConnectionRequest.find({
        $or: [
          {
            toUserId: user?._id,
            status: "accepted",
          },
          {
            fromUserId: user?._id,
            status: "accepted",
          },
        ],
      })
        .populate("fromUserId", USER_METADATA)
        .populate("toUserId", USER_METADATA)
        .lean();

      const data = connections.map((item: any) => {
        const fromUser = item.fromUserId as userModel.IUser;
        const toUser = item.toUserId as userModel.IUser;

        const connectionUser =
          fromUser._id.toString() === user?._id.toString() ? toUser : fromUser;

        return {
          connectionId: item._id,
          user: connectionUser,
        };
      });

      res.json({
        success: true,
        message: "Connections data fetched successfully",
        data: data,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
);

module.exports = userRouter;
