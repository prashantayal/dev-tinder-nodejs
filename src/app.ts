import express = require("express");
import type { Request, Response, NextFunction } from "express";

const app = express();

const { userAuth } = require("./middlewares/auth");

interface UserQuery {
  userId?: string;
}
interface UserParams {
  userId: string;
  password: string;
}

// MIDDLEWARE - generally created using use() so that the logic works for all type of requests
app.use("/user", userAuth);

// GET API call - only handle GET call to '/user'
app.get(
  "/user/getData",
  (req: Request<{}, {}, {}, UserQuery>, res: Response, next: NextFunction) => {
    /*
    Request<{}, {}, {}, UserQuery> means:
    No route params ({})
    No enforced response type ({})
    No request body ({})
    Query string type = UserQuery
  */

    const { userId } = req.query;
    console.log("User ID:", userId);

    res.json({
      firstName: "Prashant",
      lastName: "Tayal",
    });
  }
);

// Fetching data from params
app.get(
  "/user/login/:userId/:password",
  (req: Request<UserParams>, res: Response) => {
    const { userId, password } = req.params;
    console.log("User ID:", userId); // "1001"
    console.log("Password:", password); // "pass1234"

    res.status(201).json({ firstName: "Prashant", lastName: "Tayal" });
  }
);

// POST API call - only handle POST call to '/user'
app.post(
  "/user/updateData",
  (req: Request, res: Response, next: NextFunction) => {
    next(); // pass to next middleware
  },
  (req: Request, res: Response, next: NextFunction) => {
    // res.send("User data save successfully 2");
    next();
  },
  (req: Request, res: Response) => {
    res.send("User data save successfully 3");
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
app.delete("/user/deleteData", (req: any, res: any) => {
  res.send("User data deleted successfully");
});

app.listen(8000, () => {
  console.log("Server is up and running...");
});
