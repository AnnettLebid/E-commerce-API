import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} from "../errors/index.js";
import {
  createUserToken,
  attachCookiesToResponse,
  checkPermissions,
} from "../utils/index.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

export const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select("-password");

  if (!user) {
    throw new NotFoundError(`No user with id: ${id}`);
  }
  checkPermissions(req.user, user._id);

  res.status(StatusCodes.OK).json({ user });
};

export const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

export const updateUser = async (req, res) => {
  const { name, email } = req.body;
  const { userId } = req.user;

  if (!name || !email) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ _id: userId });

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createUserToken(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { userId } = req.user;

  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Please, provide both values");
  }

  const user = await User.findOne({
    _id: userId,
  });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated" });
};
