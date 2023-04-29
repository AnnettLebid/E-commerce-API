import express from "express";
import ReviewController from "../controllers/reviewController.js";
import { authenticateUser } from "../middleware/authentication.js";

const router = express.Router();
router
  .route("/")
  .get(ReviewController.getAllReviews)
  .post(authenticateUser, ReviewController.createReview);

router
  .route("/:id")
  .get(ReviewController.getSingleReview)
  .patch(authenticateUser, ReviewController.updateReview)
  .delete(authenticateUser, ReviewController.deleteReview);

export default router;
