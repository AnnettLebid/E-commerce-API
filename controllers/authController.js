import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import {
  CustomAPIError,
  UnauthenticatedError,
  BadRequestError,
} from "../errors/index.js";
import { attachCookiesToResponse, createUserToken } from "../utils/index.js";

export default class AuthController {
  static register = async (req, res) => {
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

  static login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Please provide email and password");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("Invalid credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid credentials");
    }

    const tokenUser = createUserToken(user);
    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.OK).json({ user: tokenUser });
  };

  static logout = async (req, res) => {
    res.cookie("token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.status(StatusCodes.OK).json({ msg: "user logged out!" });
  };
}
