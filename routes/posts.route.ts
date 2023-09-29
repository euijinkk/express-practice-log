import express, { NextFunction, Request, Response } from "express";
import Post from "../models/posts.model";
import User from "../models/users.model";
import { body, param, validationResult } from "express-validator";

const router = express.Router();

// 게시물 생성 시의 유효성 검사 미들웨어
const createPostValidation = [
  body("title").trim().notEmpty(),
  body("content").trim().notEmpty(),
  body("userId").isMongoId(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.error("Invalid values", 400);
    }
    next();
  },
];

// 게시물 수정 시의 유효성 검사 미들웨어
const updatePostValidation = [
  param("id").isMongoId(),
  body("title").trim().notEmpty(),
  body("content").trim().notEmpty(),
  body("userId").isMongoId(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.error("Invalid values", 400);
    }
    next();
  },
];

// 게시물 수정/삭제 권한 검사 미들웨어
async function checkPermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.body.userId;
  const id = req.params.id;
  const post = await Post.findById(id);
  if (post && post.author._id.toString() !== userId) {
    return res.error("권한이 없습니다.", 401);
  }
  next();
}

router.get("/", async (req, res) => {
  const authorId = req.query.authorId;

  const posts = await Post.find({
    author: authorId,
    isDeleted: false,
  })
    .populate("author")
    .sort({ createdAt: -1 });
  res.success(posts);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const post = await Post.find({
    _id: id,
    isDeleted: false,
  }).populate("author");

  res.success(post);
});

router.post("/", createPostValidation, async (req: Request, res: Response) => {
  const body = req.body;
  const userId = body.userId;

  const user = await User.findById(userId);

  const newPost = new Post({
    title: body.title,
    content: body.content,
    author: user,
  });
  newPost.save();

  res.success(newPost);
});

router.delete("/:id", checkPermission, async (req, res) => {
  const body = req.body;
  const userId = body.userId;
  const id = req.params.id;

  await Post.findOneAndUpdate({ _id: id, author: userId }, { isDeleted: true });

  res.success(true);
});

router.put(
  "/:id",
  checkPermission,
  updatePostValidation,
  async (req: Request, res: Response) => {
    const body = req.body;
    const userId = body.userId;
    const id = req.params.id;

    const updatedPost = await Post.findOneAndUpdate(
      { _id: id, author: userId },
      body,
      {
        new: true,
      }
    );

    res.success(updatedPost);
  }
);

export default router;
