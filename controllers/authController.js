import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import { CustomAPIError } from "../errors/custom-api.js";
import { createJWT, isTokenValid } from "../utils/index.js";

export const register = async (req, res) => {
  const { email, name, password } = req.body;
  const emailExists = await User.findOne({ email });

  if (emailExists) {
    throw new CustomAPIError("User already exist");
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;

  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  const tokenUser = { name: user.name, userId: user._id, role: user.role };

  const token = createJWT({ payload: tokenUser });

  const oneDay = 100 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
  });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

export const login = async (req, res) => {
  res.send("login");
};

export const logout = async (req, res) => {
  res.send("logout");
};
