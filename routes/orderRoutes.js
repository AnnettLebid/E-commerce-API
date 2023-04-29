import express from "express";
import OrderController from "../controllers/orderController.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication.js";

const router = express.Router();
router
  .route("/")
  .post(authenticateUser, OrderController.createOrder)
  .get(
    authenticateUser,
    authorizePermissions("admin"),
    OrderController.getAllOrders
  );

router
  .route("/showAllMyOrders")
  .get(authenticateUser, OrderController.getCurrentUserOrders);

router
  .route("/:id")
  .get(authenticateUser, OrderController.getSingleOrder)
  .patch(authenticateUser, OrderController.updateOrder);

export default router;
