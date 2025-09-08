import crypto from "crypto";

import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import generateTokenAndSetCookie from "../utils/helperFunctions/generateTokenAndSetCookie.js";

/*
import {
  sendVerificationEmail,
  welcomeEmail,
  sendResetPasswordEmail,
} from "../middlewares/mailtrap/emails.js";
 */

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All Fields Must Be Filled!!");
  }

  const userExist = await User.findOne({ email });

  if (userExist) throw new ApiError(409, "User Already Exist!!");

  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const newUser = new User({
    name,
    email,
    password,
    verificationToken,
    verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });

  await newUser.save();

  generateTokenAndSetCookie(res, newUser._id);

  // await sendVerificationEmail({
  //   name: newUser.name,
  //   email: newUser.email,
  //   verificationToken: newUser.verificationToken,
  // });

  res.status(201).json(
    new ApiResponse(201, "User Has Been Created Successfully", {
      ...newUser._doc,
      password: undefined,
    }).toJSON()
  );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const user = await User.findOneAndUpdate(
    {
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    },
    {
      $set: { isVerified: true },
      $unset: { verificationToken: "", verificationTokenExpiresAt: "" },
    },
    { new: true }
  );

  if (!user) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid Or Expired Verification Code"));
  }

  // welcomeEmail({
  //   name: user.name,
  //   email: user.email,
  // });

  res.status(200).json(
    new ApiResponse(200, "User Has Been Verified", {
      ...user._doc,
      password: undefined,
    })
  );
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || email.trim() === "") {
    throw new ApiError(400, "Email Field Must Be Field");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User Not Found");
  }

  if (!user.isVerified) throw new ApiError(400, "Verify The Email First");

  const resetToken = crypto.randomBytes(20).toString("hex");

  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        resetPasswordToken: resetToken,
        resetPasswordExpiresAt: Date.now() + 10 * 60 * 1000,
      },
    }
  );

  // await sendResetPasswordEmail(
  //   user.name,
  //   user.email,
  //   `${process.env.CLIENT_URI}/forgot-password/${resetToken}`
  // );

  res.status(200).json(
    new ApiResponse(200, "Reset Password Sent Successfully", {
      user: { ...user._doc, password: undefined },
    })
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All Credentials Required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Sign Up First");
  }

  const isPasswordMatch = await user.isPasswordMatch(password);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid Credentials");
  }

  generateTokenAndSetCookie(res, user._id);

  await User.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });

  res.status(200).json(
    new ApiResponse(200, "User Logged In Successfully!!!", {
      user: { ...user._doc, password: undefined },
    })
  );
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json(new ApiResponse(200, "Deleted Cookies"));
});
