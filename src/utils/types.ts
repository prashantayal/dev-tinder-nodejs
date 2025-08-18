import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";
import type userType = require("../models/user.model");

export interface AuthRequest extends Request {
  user?: userType.IUser;
}
export interface SignupRequest extends Request {
  body: {
    firstName: string;
    lastName: string;
    emailID: string;
    password: string;
  };
}
export interface UpdateUserRequest extends Request {
  user?: userType.IUser;
  body: Partial<userType.IUser>;
}
export interface MyJwtPayload extends JwtPayload {
  _id: string;
}
