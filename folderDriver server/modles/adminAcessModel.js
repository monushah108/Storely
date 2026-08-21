import { Schema, model } from "mongoose";
import crypto from "crypto";

const adminAccessSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    usedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

adminAccessSchema.statics.generateToken = function () {
  return crypto.randomBytes(32).toString("hex");
};

adminAccessSchema.statics.hashToken = function (token) {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const AdminAccess = model("AdminAccess", adminAccessSchema);

export default AdminAccess;
