import { Request, Response, NextFunction } from "express";

function handleError(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(error);
  res.error("Internal Server Error", 500);
}

export default handleError;
