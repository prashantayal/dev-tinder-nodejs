const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://prashant:GxVj1c43rG1NjtOq@appbuilder.phgfylh.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
