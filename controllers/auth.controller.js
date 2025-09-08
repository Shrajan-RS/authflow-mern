import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import generateTokenAndSetCookie from "../utils/helperFunctions/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  welcomeEmail,
} from "../middlewares/mailtrap/emails.js";

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

  await sendVerificationEmail({
    name: newUser.name,
    email: newUser.email,
    verificationToken: newUser.verificationToken,
  });

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

  welcomeEmail({
    name: user.name,
    email: user.email,
  });

  res.status(200).json(
    new ApiResponse(200, "User Has Been Verified", {
      ...user._doc,
      password: undefined,
    })
  );
});

export const login = asyncHandler(async (req, res) => {});
export const logout = asyncHandler(async (req, res) => {});
