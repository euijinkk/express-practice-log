require("dotenv").config();
import express from "express";
import connectDB from "./schemas";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import usersRouter from "./routes/users.route";
import todosRouter from "./routes/todos.route";
import swaggerRouter from "./swagger";
import cors from "cors";

const app = express();
// 특정 도메인만 허용하려면 다음과 같이 설정합니다:
// app.use(cors({
//   origin: 'https://example.com'
// }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/users", usersRouter);
app.use("/todos", todosRouter);
app.use(swaggerRouter);

connectDB();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
