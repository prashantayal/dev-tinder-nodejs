import type { Request } from "express";

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
