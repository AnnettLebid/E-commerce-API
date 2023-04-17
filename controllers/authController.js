import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import { CustomAPIError } from "../errors/custom-api.js";
import { attachCookiesToResponse, createUserToken } from "../utils/index.js";
import { UnauthenticatedError } from "./../errors/unauthenticated.js";

export const register = async (req, res) => {
  const { email, name, password } = req.body;
  const emailExists = await User.findOne({ email });

  if (emailExists) {
    throw new CustomAPIError("User already exist");
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;

  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  const tokenUser = createUserToken(user);

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomAPIError.BadRequestError(
      "Please provide email and password"
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomAPIError.UnauthenticatedError("Invalid credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomAPIError.UnauthenticatedError("Invalid credentials");
  }

  const tokenUser = createUserToken(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};
