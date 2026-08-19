import { Schema, model } from "mongoose";

const quotaSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },

    storageUsed: {
      type: Number,
      default: 0,
      min: 0,
    },

    storageLimit: {
      type: Number,
      default: 1024 * 1024 * 50,
    },
  },
  {
    timestamps: true,
  },
);

const Quota = model("Quota", quotaSchema);

export default Quota;
