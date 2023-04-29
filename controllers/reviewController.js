import StatusCodes from "http-status-codes";
import { Review } from "../models/Review.js";
import { Product } from "../models/Product.js";
import { checkPermissions } from "../utils/index.js";
import {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} from "../errors/index.js";

export default class ReviewController {
  static createReview = async (req, res) => {
    const { product: productId } = req.body;
    const { userId } = req.user;

    const isValidProduct = await Product.findOne({ _id: productId });

    if (!isValidProduct) {
      throw new NotFoundError(`No product with id: ${productId}`);
    }

    const alreadySubmitted = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (alreadySubmitted) {
      throw new BadRequestError(`Already submitted review for this product`);
    }

    req.body.user = req.user.userId;
    const review = await Review.create(req.body);

    res.status(StatusCodes.CREATED).json({ review });
  };

  static getAllReviews = async (req, res) => {
    const reviews = await Review.find({}).populate({
      path: "product",
      select: "name company price",
    });

    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
  };

  static getSingleReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
      throw new NotFoundError(`No review with id: ${reviewId}`);
    }

    res.status(StatusCodes.OK).json({ review });
  };

  static updateReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
      throw new NotFoundError(`No review with id: ${reviewId}`);
    }

    checkPermissions(req.user, review.user);

    review.rating = rating;
    review.title = title;
    review.comment = comment;

    await review.save();

    res.status(StatusCodes.OK).json({ review });
  };

  static deleteReview = async (req, res) => {
    const { id: reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
      throw new NotFoundError(`No review with id: ${reviewId}`);
    }

    checkPermissions(req.user, review.user);

    await review.remove();

    res.status(StatusCodes.OK).json({ msg: "Success! Review removed!" });
  };

  static getSingleProductReviews = async (req, res) => {
    const { id: productId } = req.params;
    const reviews = await Review.find({ product: productId });
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
  };
}
