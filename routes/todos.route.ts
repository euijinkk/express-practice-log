import express from "express";
import Todo from "../models/todos.model";

const router = express.Router();

router.get("/", async (req, res) => {
  const body = req.body;
  // 유저를 찾는다
  const userId = body.userId;

  // 유저 정보를 기반으로, todos에서 긁어온다
  const todos = await Todo.find({ userId, isDeleted: false });

  res.success(todos);
});

router.get("/:id", async (req, res) => {
  const body = req.body;
  const userId = body.userId;
  const id = req.params.id;

  const todo = await Todo.find({
    userId,
    _id: id,
    isDeleted: false,
  });

  res.success(todo);
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

  res.success(newTodo);
});

router.delete("/:id", async (req, res) => {
  const body = req.body;
  const userId = body.userId;
  const id = req.params.id;

  // Todo 를 삭제한다.
  await Todo.findOneAndUpdate({ _id: id, userId }, { isDeleted: true });

  res.success(true);
});

export default router;
