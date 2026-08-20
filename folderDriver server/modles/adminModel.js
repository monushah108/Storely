import { Schema, model } from "mongoose";

const adminCredentialSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

const AdminCredential = model("AdminCredential", adminCredentialSchema);

export default AdminCredential;
