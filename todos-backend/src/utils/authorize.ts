import { NextFunction, Request, Response } from "express";

const protectedRouter = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next()
}

export default protectedRouter;