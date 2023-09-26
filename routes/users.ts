import express from "express";
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/signup", (req, res) => {
  console.log("req", req.body);

  res.send("success");
});

export default router;
