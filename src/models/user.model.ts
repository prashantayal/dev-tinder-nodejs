import mongoose = require("mongoose");
import validator = require("validator");

const { Schema, model } = mongoose;

interface IUser extends mongoose.Document {
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

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    emailID: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      immutable: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: (props: any) => `${props.value}`,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      validate: {
        validator: (value: string) => validator.isStrongPassword(value),
        message: (props: any) => `${props.value}`,
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    photoUrl: {
      type: String,
      default:
        "https://cdn.vectorstock.com/i/500p/46/76/gray-male-head-placeholder-vector-23804676.jpg",
      validate: {
        validator: (value: string) => validator.isURL(value),
        message: (props: any) => `${props.value}`,
      },
    },
    about: {
      type: String,
      default: "Hi I'm new here!",
      trim: true,
      maxlength: 200,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

module.exports = User;
