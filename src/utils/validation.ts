import type { Request } from "express";
import validator = require("validator");

const validateSignupData = (req: Request): void => {
  const { firstName, lastName, emailID, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (firstName.length < 3 || firstName.length > 50) {
    throw new Error("First name should be 3-50 characters");
  } else if (lastName.length < 3 || lastName.length > 50) {
    throw new Error("Last name should be 3-50 characters");
  } else if (!validator.isEmail(emailID)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

module.exports = { validateSignupData };
