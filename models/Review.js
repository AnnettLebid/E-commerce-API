import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide title"],
      maxLength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please provide review text"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true }); //only one review per product per user

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  console.log("product", productId);
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.product);

  console.log("post save hook");
});

ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.product);

  console.log("post remove hook");
});

export const Review = mongoose.model("Review", ReviewSchema);
