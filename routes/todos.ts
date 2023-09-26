import express from "express";
import Todo from "../models/todos";

const router = express.Router();

router.get("/", async (req, res) => {
  const body = req.body;
  // 유저를 찾는다
  const userId = body.userId;

  // 유저 정보를 기반으로, todos에서 긁어온다
  const todos = await Todo.find({ userId, isDeleted: false });

  res.status(200).send(todos);
});

router.get("/:id", async (req, res) => {
  const body = req.body;
  const userId = body.userId;
  const id = req.params.id;

  const todo = await Todo.find({
    userId,
    id: id,
    isDeleted: false,
  });

  res.status(200).send(todo);
});

router.post("/", async (req, res) => {
  const body = req.body;
  // 유저를 찾는다
  const userId = body.userId;

  // Todo 를 생성한다.
  const newTodo = new Todo({
    title: body.title,
    userId: userId,
  });
  newTodo.save();

  res.status(200).send(newTodo);
});

router.delete("/", async (req, res) => {
  const body = req.body;
  const userId = body.userId;
  const id = body.id;

  // Todo 를 삭제한다.
  await Todo.findOneAndUpdate({ id, userId }, { isDeleted: true });

  res.status(200).send({ message: "success" });
});
