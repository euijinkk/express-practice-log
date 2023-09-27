import { Request, NextFunction, Response } from "express";

function handleResponse(req: Request, res: Response, next: NextFunction): void {
  // success 함수를 통해 성공 응답을 보냅니다.
  res.success = (data: any) => {
    res.status(200).json({
      success: true,
      data,
    });
  };

  // error 함수를 통해 실패 응답을 보냅니다.
  res.error = (message: string, statusCode: number = 500) => {
    res.status(statusCode).json({
      success: false,
      error: message,
    });
  };

  next(); // 다음 미들웨어로 이동
}

export default handleResponse;
