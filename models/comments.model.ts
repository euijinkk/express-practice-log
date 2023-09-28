import mongoose, { Document, PopulatedDoc, Schema } from "mongoose";
import { IUser } from "./users.model";
import { IPost } from "./posts.model";

interface IComment extends Document {
  content: string;
  post: PopulatedDoc<IPost>;
  author: PopulatedDoc<IUser>;
}

const commentsSchema = new Schema(
  {
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentsSchema);
export default Comment;
