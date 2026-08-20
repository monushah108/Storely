import crypto from "crypto";
import { Schema, model } from "mongoose";

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
      required: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
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

adminAccessSchema.methods.isValid = function () {
  return !this.usedAt && this.expiresAt > new Date();
};

const AdminAccess = model("AdminAccess", adminAccessSchema);

export default AdminAccess;
