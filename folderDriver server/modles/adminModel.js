import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const adminCredentialSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    password: {
      type: String,
      required: true,
      select: true,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
adminCredentialSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// Compare password
adminCredentialSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const AdminCredential = model("AdminCredential", adminCredentialSchema);

export default AdminCredential;
