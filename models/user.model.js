import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email Is Required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password Is Required"],
    },
    name: {
      type: String,
      required: [true, "Name Is Required"],
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 13);
    next();
  } catch (error) {
    console.log(`Failed To Hash Password: ${error}`);
    next(error);
  }
});

userSchema.methods.isPasswordMatch = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.JWT_SECRET_TOKEN,
    {
      expiresIn: process.env.JWT_SECRET_TOKEN_EXPIRES,
    }
  );
};

export const User = mongoose.model("User", userSchema);
