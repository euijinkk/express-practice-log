require("dotenv").config();
import express from "express";
import connectDB from "./schemas";
import path from "path";
import cookieParser from "cookie-parser";

import usersRouter from "./routes/users.route";
import todosRouter from "./routes/todos.route";
import postsRouter from "./routes/posts.route";
import commentsRouter from "./routes/comments.route";

import swaggerRouter from "./swagger";
import cors from "cors";
import handleError from "./middlewares/handleError";
import handleResponse from "./middlewares/handleResponse";
import morganMiddleware from "./logger/morganMiddleware";
import winstonMiddleware from "./logger/winstonMiddleware";

const app = express();
// 특정 도메인만 허용하려면 다음과 같이 설정합니다:
// app.use(cors({
//   origin: 'https://example.com'
// }));

app.use(morganMiddleware);
app.use(winstonMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use(handleResponse);
app.use(handleError);

app.use("/users", usersRouter);
app.use("/todos", todosRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use(swaggerRouter);

connectDB();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
