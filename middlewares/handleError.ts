import { Request, Response, NextFunction } from "express";

// 모든 에러가 여기로 도달하는 것이 아니다. 왜 그러지?
function handleError(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.error("Internal Server Error", 500);
}

export default handleError;
