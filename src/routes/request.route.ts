import express = require("express");
import type { Request, Response } from "express";
import type { AuthRequest } from "../utils/types";
const { userAuth } = require("../middleware/auth.middleware");

const requestRouter = express.Router();

// #region Send request
requestRouter.post(
  "/sendFriendRequest",
  userAuth,
  async (req: AuthRequest, res: Response) => {
    const { user } = req;
    res.send("Friend Request Sent by " + user?.firstName);
  }
);
//#endregion

module.exports = requestRouter;
