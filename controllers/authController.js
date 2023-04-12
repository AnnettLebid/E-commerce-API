import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import { CustomAPIError } from "../errors/custom-api.js";

export const register = async (req, res) => {
  const { email, name, password } = req.body;
  const emailExists = await User.findOne({ email });

  if (emailExists) {
    throw new CustomAPIError("User already exist");
  }

  //first user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });
  res.status(StatusCodes.CREATED).json({ user });
};

export const login = async (req, res) => {
  res.send("login");
};

export const logout = async (req, res) => {
  res.send("logout");
};
