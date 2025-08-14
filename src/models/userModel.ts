import console = require("console");

const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
      match: [/^[a-zA-Z]+$/, "First name must only contain letters"],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50,
      match: [/^[a-zA-Z]+$/, "Last name must only contain letters"],
    },
    emailID: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      immutable: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],

      // Default - This method is called only when a new document is created
      validate(value: string) {
        if (!["Male", "Female", "Other"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://cdn.vectorstock.com/i/500p/46/76/gray-male-head-placeholder-vector-23804676.jpg",
      match: [/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i, "Invalid URL"],
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
  { timestamps: true } // provides createdAt, updatedAt automatically
);

module.exports = model("User", userSchema);
