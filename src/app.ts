const express = require("express");

const app = express();

// Match all the HTTP method API calls to '/test'
app.use("/test", (req: any, res: any) => {
  res.send("Hey! 👋");
});

// GET API call - only handle GET call to '/user'
app.get("/user", (req: any, res: any) => {
  console.log(req.query); // user?userId=1001
  res.send({ firstName: "Prashant", lastName: "Tayal" });
});

// Fetching data from params
app.get("/user/:userId/:password", (req: any, res: any) => {
  console.log(req.params); // user/1001/pass1234
  res.send({ firstName: "Prashant", lastName: "Tayal" });
});

// POST API call - only handle POST call to '/user'
app.post(
  "/user",
  (req: any, res: any, next: any) => {
    // res.send("User data save successfully");
    next();
  },
  (req: any, res: any, next: any) => {
    res.send("User data save successfully 2");
    // next();
  },
  (req: any, res: any) => {
    res.send("User data save successfully 3");
    // next();
  }
  /* 
    - Will always handle the first handler.

    - res.send() sends the control back / ends the API call.

    - next() -> moves the control to next route handler -- adding another function in the callstack, the next route handler is executed. 
      After the execution is completed, the control is sent back to the previous route handler.

    - If we have multiple route handlers, but no next(), then the other route handlers will not be added in the callstack.

    - Having res.send() in both handlers will send an error as the connection is lost after the first handler sends the response.
      Therefore, always do res.send() from 1 handler only.

    - If next() is in the last function, an error will be thrown as no other function is called.
  */
);

// DELETE API call
app.delete("/user", (req: any, res: any) => {
  res.send("User data deleted successfully");
});

app.listen(8000, () => {
  console.log("Server is up and running...");
});
