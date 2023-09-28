import express, { NextFunction, Request, Response } from "express";
import Comment from "../models/comments.model";
import User from "../models/users.model";
import { body, param, validationResult } from "express-validator";

const router = express.Router();

// 댓글 생성 시의 유효성 검사 미들웨어
const createCommentValidation = [
  body("content").trim().notEmpty(),
  body("postId").trim().notEmpty(),
  body("userId").isMongoId(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.error("Invalid values", 400);
    }
    next();
  },
];

// 댓글 수정 시의 유효성 검사 미들웨어
const updateCommentValidation = [
  param("id").isMongoId(),
  body("content").trim().notEmpty(),
  body("postId").isMongoId(),
  body("userId").isMongoId(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.error("Invalid values", 400);
    }
    next();
  },
];

// 댓글 수정/삭제 권한 검사 미들웨어
async function checkPermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.body.userId;
  const id = req.params.id;
  const comment = await Comment.findById(id);
  if (comment && comment.author._id.toString() !== userId) {
    return res.error("권한이 없습니다.", 401);
  }
  next();
}

// 특정 유저 / 특정 게시물에 대한 댓글 보기
router.get("/", async (req, res) => {
  const authorId = req.query.authorId;
  const postId = req.query.postId;

  const comments = await Comment.find({
    author: authorId,
    post: postId,
    isDeleted: false,
  })
    .populate("author")
    .populate("post")
    .sort({ createdAt: -1 });
  res.success(comments);
});

// 댓글 단건 조회
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const comment = await Comment.find({
    _id: id,
    isDeleted: false,
  })
    .populate("author")
    .populate("post");

  res.success(comment);
});

router.post(
  "/",
  createCommentValidation,
  async (req: Request, res: Response) => {
    const body = req.body;
    const userId = body.userId;

    const user = await User.findById(userId);

    const newComment = new Comment({
      content: body.content,
      post: body.postId,
      author: user,
    });
    newComment.save();

    res.success(newComment);
  }
);

router.delete("/:id", checkPermission, async (req, res) => {
  const body = req.body;
  const userId = body.userId;
  const id = req.params.id;

  await Comment.findOneAndUpdate(
    { _id: id, author: userId },
    { isDeleted: true }
  );

  res.success(true);
});

router.put(
  "/:id",
  checkPermission,
  updateCommentValidation,
  async (req: Request, res: Response) => {
    const body = req.body;
    const userId = body.userId;
    const id = req.params.id;

    const updatedComment = await Comment.findOneAndUpdate(
      { _id: id, author: userId },
      body,
      {
        new: true,
      }
    );
    res.success(updatedComment);
  }
);

export default router;
