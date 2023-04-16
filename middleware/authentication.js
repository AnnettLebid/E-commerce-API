import { CustomAPIError } from "../errors/custom-api.js";

import { isTokenValid } from "../utils/index.js";
import { UnauthorizedError } from "./../errors/unauthorized.js";

export const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomAPIError.UnauthenticatedError("Authentication invalid");
  }

  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (err) {
    throw new CustomAPIError.UnauthenticatedError("Authentication invalid");
  }
};

export const authorizePermissions = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new CustomAPIError.UnauthorizedError(
      "Unauthorized to access this route"
    );
  }
  next();
};
