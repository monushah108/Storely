import { model, Schema } from "mongoose";

const directorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
    parentDirId: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Directory",
    },
  },
  {
    timestamps: true,
  },
);

const Directory = model("Directory", directorySchema);

export default Directory;
