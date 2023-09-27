import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  age: number;
}

const usersSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
  },
  { timestamps: true }
);
// "User" -> "users" collection에 저장한다는 의미
const User = mongoose.model<IUser>("User", usersSchema);
export default User;
