const express = require("express");

import type { Response } from "express";
import type { AuthRequest } from "../utils/types";
import UserModel = require("../models/user.model");
import type connectionRequestModel = require("../models/connectionRequest.model");

const { userAuth } = require("../middleware/auth.middleware");
const ConnectionRequest = require("../models/connectionRequest.model");
const User = require("../models/user.model");

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
        const fromUser = item.fromUserId as UserModel.IUser;
        const toUser = item.toUserId as UserModel.IUser;

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

// #region Feed
userRouter.get(
  "/user/feed",
  userAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      // /user/feed?page=1&limit=10
      const page = parseInt(req.query.page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      limit = limit > 50 ? 50 : limit;
      const skip = (page - 1) * limit;

      const user = req.user;
      const connections = await ConnectionRequest.find({
        $or: [{ fromUserId: user?._id }, { toUserId: user?._id }],
      })
        .select("fromUserId toUserId")
        .lean();

      const hideUsers = new Set<string>();

      user && hideUsers.add(user._id.toString());

      connections.forEach((item: connectionRequestModel.IConnectionRequest) => {
        hideUsers.add(item.fromUserId.toString());
        hideUsers.add(item.toUserId.toString());
      });

      const feedUsers = await User.find({
        _id: { $nin: Array.from(hideUsers) },
      })
        .select(USER_METADATA)
        .skip(skip)
        .limit(limit)
        .lean();

      res.json({
        success: true,
        message: "Feed data fetched successfully",
        data: feedUsers,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
);

module.exports = userRouter;
