import express from "express";
import UserController from "../controllers/userController.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication.js";

const router = express.Router();

router
  .route("/")
  .get(
    authenticateUser,
    authorizePermissions("admin"),
    UserController.getAllUsers
  );
router.route("/showMe").get(authenticateUser, UserController.showCurrentUser);

router.route("/updateUser").patch(authenticateUser, UserController.updateUser);
router
  .route("/updateUserPassword")
  .patch(authenticateUser, UserController.updateUserPassword);

router.route("/:id").get(authenticateUser, UserController.getSingleUser);

export default router;
