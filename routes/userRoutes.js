import express from "express";
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication.js";

const router = express.Router();

router.route("/").get(authenticateUser, authorizePermissions, getAllUsers);
router.route("/showMe").get(showCurrentUser);

router.route("/updateUser").patch(updateUser);
router.route("/updateUserPassword").patch(updateUserPassword);

router.route("/:id").get(authenticateUser, getSingleUser);

export default router;