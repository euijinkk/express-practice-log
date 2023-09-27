import express, { Request, Response } from "express";
import Post from "../models/posts.model";
import User from "../models/users.model";
import { body, param, validationResult } from "express-validator";

const router = express.Router();

// 게시물 생성 시의 유효성 검사 미들웨어
const createPostValidation = [
  body("title").trim().notEmpty().withMessage("제목을 입력하세요."),
  body("content").trim().notEmpty().withMessage("내용을 입력하세요."),
  body("userId").isMongoId().withMessage("올바른 사용자 ID가 필요합니다."),
];

// 게시물 수정 시의 유효성 검사 미들웨어
const updatePostValidation = [
  param("id").isMongoId().withMessage("올바른 게시물 ID가 필요합니다."),
  body("title").trim().notEmpty().withMessage("제목을 입력하세요."),
  body("content").trim().notEmpty().withMessage("내용을 입력하세요."),
  body("userId").isMongoId().withMessage("올바른 사용자 ID가 필요합니다."),
];

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

router.post("/", createPostValidation, async (req: Request, res: Response) => {
  // express-validator에서 유효성 검사 수행
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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

router.put(
  "/:id",
  updatePostValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const body = req.body;
    const userId = body.userId;
    const id = req.params.id;

    const post = await Post.findById(id);
    if (post && post.author._id.toString() !== userId) {
      return res.status(401).send({ message: "수정 권한이 없습니다." });
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: id, author: userId },
      body
    );

    res.status(200).send(updatedPost);
  }
);

export default router;
