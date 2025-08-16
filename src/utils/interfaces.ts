import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

export interface SignupRequest extends Request {
  body: {
    firstName: string;
    lastName: string;
    emailID: string;
    password: string;
  };
}

export interface UpdateUserRequest extends Request {
  body: {
    id?: string;
    firstName?: string;
    lastName?: string;
    emailID?: string;
  };
}

export interface MyJwtPayload extends JwtPayload {
  _id: string;
}
