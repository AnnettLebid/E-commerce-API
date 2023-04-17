import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import { CustomAPIError } from "../errors/custom-api.js";
import { UnauthenticatedError } from "./../errors/unauthenticated.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

export const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select("-password");

  if (!user) {
    throw new CustomAPIError.NotFoundError(`No user with id: ${id}`);
  }

  res.status(StatusCodes.OK).json({ user });
};

export const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

export const updateUser = async (req, res) => {
  res.send("updateUser");
};

export const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  console.log("oldPassword", oldPassword);
  const { userId } = req.user;

  if (!oldPassword || !newPassword) {
    throw new CustomAPIError.BadRequestError("Please, provide both values");
  }

  const user = await User.findOne({
    _id: userId,
  });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomAPIError.UnauthenticatedError("Invalid credentials");
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated" });
};
