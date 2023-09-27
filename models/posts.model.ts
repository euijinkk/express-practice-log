import mongoose, { Document, Schema } from "mongoose";

interface IPost extends Document {
  title: string;
  isCompleted: boolean;
}

const postsSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: {
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

const Post = mongoose.model<IPost>("Todo", postsSchema);
export default Post;
