import mongoose from "mongoose";

const dbUrl = process.env.DB_URL ?? "";

const connectDB = async () => {
  // 만일 배포용이 아니라면, 디버깅 on
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true); // 몽고 쿼리가 콘솔에서 뜨게 한다.
  }

  try {
    const res = await mongoose.connect(dbUrl, {
      dbName: "todo-app", // 실제로 데이터 저장할 db명
      autoIndex: true,
    });
    console.log("mongodb 연결 성공");
  } catch (e) {
    console.log("mongodb 연결 실패");
  }
};

// 몽구스 커넥션에 이벤트 리스너를 달게 해준다. 에러 발생 시 에러 내용을 기록하고, 연결 종료 시 재연결을 시도한다.
mongoose.connection.on("error", (error: any) => {
  console.error("몽고디비 연결 에러", error);
});

mongoose.connection.on("disconnected", () => {
  console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.");
  connectDB(); // 연결 재시도
});

export default connectDB;
