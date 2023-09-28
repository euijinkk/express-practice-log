import express from "express";
import User from "../models/users.model";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const body = req.body;

  // validation
  if (!body.email || !body.email.includes("@")) {
    return res.error("유효한 이메일을 입력해주세요.", 400);
  }

  if (!body.password || body.password.length < 5) {
    return res
      .status(400)
      .send({ message: "비밀번호는 5자 이상이어야 합니다." });
  }

  if (!body.name) {
    return res.error("이름은 필수입니다.", 400);
  }

  if (!body.age || typeof body.age !== "number" || body.age <= 0) {
    return res.error("나이는 양수이어야 합니다.", 400);
  }

  // DB 에 중복 있는지 확인
  const existingUser = await User.findOne({ email: body.email });
  if (existingUser) {
    return res.error("이미 존재하는 이메일입니다.", 400);
  }

  // DB 저장
  const user = new User({
    email: body.email,
    password: body.password,
    name: body.name,
    age: body.age,
  });
  user.save();

  // 성공, 실패 응답
  res.success(user);
});

router.post("/login", async (req, res) => {
  const body = req.body;

  // validation
  if (!body.email || !body.email.includes("@")) {
    return res.error("유효한 이메일을 입력해주세요.", 400);
  }

  if (!body.password) {
    return res.error("비밀번호를 입력해주세요.", 400);
  }

  // DB에 있는지 확인
  const existingUser = await User.findOne({
    email: body.email,
    password: body.password,
  });
  if (existingUser == null) {
    return res.error("email 또는 password가 틀렸습니다.", 400);
  }

  res.success({
    name: existingUser.name,
    email: existingUser.email,
    age: existingUser.age,
    id: existingUser.id,
  });
});

export default router;
