import express from "express";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication.js";
import ProductController from "../controllers/productController.js";
import ReviewController from "../controllers/reviewController.js";

const router = express.Router();

router
  .route("/")
  .get(ProductController.getAllProducts)
  .post(
    [authenticateUser, authorizePermissions("admin")],
    ProductController.createProduct
  );

router
  .route("/uploadImage")
  .post(
    [authenticateUser, authorizePermissions("admin")],
    ProductController.uploadImage
  );

router
  .route("/:id")
  .get(ProductController.getSingleProduct)
  .patch(
    [authenticateUser, authorizePermissions("admin")],
    ProductController.updateProduct
  )
  .delete(
    [authenticateUser, authorizePermissions("admin")],
    ProductController.deleteProduct
  );

router.route("/:id/reviews").get(ReviewController.getSingleProductReviews);

export default router;
