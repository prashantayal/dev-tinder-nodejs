import mongoose = require("mongoose");

export interface IUser extends mongoose.Document {
  _id: string;
  firstName: string;
  lastName?: string;
  emailID: string;
  password: string;
  age?: number;
  gender?: "Male" | "Female" | "Other";
  photoUrl?: string;
  about?: string;
  skills?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
