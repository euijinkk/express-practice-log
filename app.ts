require("dotenv").config();
import express from "express";
import connectDB from "./schemas";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import usersRouter from "./routes/users";
import swaggerRouter from "./swagger";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use(swaggerRouter);

connectDB();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/123", (req, res) => {
  console.log(req);
  res.send("Hello, World!");
});

export default app;
