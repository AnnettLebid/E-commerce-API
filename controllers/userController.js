import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import { CustomAPIError } from "../errors/custom-api.js";

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
  res.send("showCurrentUser");
};

export const updateUser = async (req, res) => {
  res.send("updateUser");
};

export const updateUserPassword = async (req, res) => {
  res.send("updateUserPassword");
};
