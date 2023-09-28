import { NextFunction, Request, Response } from "express";
import logger from "./winston";

const winstonMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    if (res.statusCode >= 400) {
      logger.error(`${req.method} ${req.url} ${res.statusCode}`);
    }
  });
  next();
};

export default winstonMiddleware;
