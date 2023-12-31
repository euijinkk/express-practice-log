import mongoose, { Document, PopulatedDoc, Schema } from "mongoose";
import { IUser } from "./users.model";

export interface IPost extends Document {
  title: string;
  content: string;
  author: PopulatedDoc<IUser>;
}

const postsSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postsSchema);
export default Post;
