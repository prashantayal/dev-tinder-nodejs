const express = require("express");

const app = express();

app.use("/test", (req: any, res: any) => {
  res.send("Hey! 👋");
});

app.listen(3000, () => {
  console.log("Server is up and running...");
});
