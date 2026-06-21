import { Schema, model } from "mongoose";

const shareSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fileId: {
    type: Schema.Types.ObjectId,
    ref: "File",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },

  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 7 * 60 * 60 * 24,
  },
});

shareSchema.methods.verifyToken = function (token) {
  return this.token == token;
};

const Share = model("Share", shareSchema);

export default Share;
