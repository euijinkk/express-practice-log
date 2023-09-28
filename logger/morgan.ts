import morgan from "morgan";
import dotenv from "dotenv";
import logger from "./winston";

dotenv.config(); // 노드 환경 변수 사용

// 로그 작성을 위한 Output stream 옵션.
const stream = {
  write: (message: string) => {
    logger.info(
      message.replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        ""
      )
    );
  },
};

// 적용될 morgan 미들웨어 형태
const morganMiddleware = morgan("dev", { stream });

export default morganMiddleware;
