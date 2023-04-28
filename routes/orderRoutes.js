import express from "express";
import {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  getCurrentUserOrders,
} from "../controllers/orderController.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication.js";

const router = express.Router();
router
  .route("/")
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizePermissions("admin"), getAllOrders);

router.route("/showAllMyOrders").get(authenticateUser, getCurrentUserOrders);

router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);

export default router;
