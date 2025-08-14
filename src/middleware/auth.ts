import type { Request, Response, NextFunction } from "express";

const userAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"] as string | undefined;
  const isAuthorised = token === "auth_token";

  if (!isAuthorised) {
    res.status(401).send("Unauthorised request");
  } else {
    next();
  }
};

module.exports = { userAuth };
