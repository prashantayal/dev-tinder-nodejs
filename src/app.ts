const express = require("express");

const app = express();

// MAtch all the HTTP method API calls to '/test'
app.use("/test", (req: any, res: any) => {
  res.send("Hey! 👋");
});

// GET API call - only handle GET call to '/user'
app.get("/user", (req: any, res: any) => {
  res.send("User data will be returned here");
});

// POST API call - only handle POST call to '/user'
app.post("/user", (req: any, res: any) => {
  res.send("User data save successfully");
});

// DELETE API call
app.delete("/user", (req: any, res: any) => {
  res.send("User data deleted successfully");
});

app.listen(8000, () => {
  console.log("Server is up and running...");
});
