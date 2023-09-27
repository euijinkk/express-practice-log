import express from "express";
import Post from "../models/posts.model";
import User from "../models/users.model";

const router = express.Router();

router.get("/", async (req, res) => {
  const authorId = req.query.authorId;

  if (authorId == null) {
    const posts = await Post.find({ isDeleted: false })
      .populate("author")
      .sort({ createdAt: -1 });
    return res.status(200).send(posts);
  }

  const posts = await Post.find({
    author: authorId,
    isDeleted: false,
  })
    .populate("author")
    .sort({ createdAt: -1 });
  res.status(200).send(posts);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const post = await Post.find({
    _id: id,
    isDeleted: false,
  }).populate("author");

  res.status(200).send(post);
});

router.post("/", async (req, res) => {
  const body = req.body;
  const userId = body.userId;

  const user = await User.findById(userId);

  const newPost = new Post({
    title: body.title,
    content: body.content,
    author: user,
  });
  newPost.save();

  res.status(200).send(newPost);
});

router.delete("/:id", async (req, res) => {
  const body = req.body;
  const userId = body.userId;
  const id = req.params.id;

  const post = await Post.findById(id);
  if (post && post.author._id.toString() !== userId) {
    return res.status(401).send({ message: "삭제 권한이 없습니다." });
  }

  await Post.findOneAndUpdate({ _id: id, author: userId }, { isDeleted: true });

  res.status(200).send({ message: "success" });
});

router.put("/:id", async (req, res) => {
  const body = req.body;
  const userId = body.userId;
  const id = req.params.id;

  const post = await Post.findById(id);
  if (post && post.author._id.toString() !== userId) {
    return res.status(401).send({ message: "수정 권한이 없습니다." });
  }

  if (body.title == null || body.content == null) {
    return res.status(400).send({ message: "title, content를 채워주세요" });
  }

  const updatedPost = await Post.findOneAndUpdate(
    { _id: id, author: userId },
    body
  );

  res.status(200).send(updatedPost);
});

export default router;