import mongoose, { Document, Schema } from "mongoose";

interface ITodo extends Document {
  title: string;
  isCompleted: boolean;
}

const todosSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    isCompleted: {
      type: Boolean,
      default: false,
    },
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

const Todo = mongoose.model<ITodo>("Todo", todosSchema);
export default Todo;
