import mongoose, { model, Schema } from "mongoose";

const sesssionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600,
    },
  },
  {
    statics: "throw",
  }
);

const Session = model("session", sesssionSchema);

export default Session;
