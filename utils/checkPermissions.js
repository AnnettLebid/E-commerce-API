import { UnauthorizedError } from "../errors/index.js";

export const checkPermissions = (requestUser, resourseUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourseUserId.toString()) return;
  throw new UnauthorizedError("Not authorized to access this route");
};
