import path from "path";
import * as url from "url";
import { StatusCodes } from "http-status-codes";
import { Product } from "../models/Product.js";
import { NotFoundError, BadRequestError } from "../errors/index.js";

export const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);

  res.status(StatusCodes.CREATED).send({ product });
};

export const getAllProducts = async (req, res) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ products, count: products.length });
};

export const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId }).populate("reviews");

  if (!product) {
    throw new NotFoundError(`No product with id: ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

export const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new NotFoundError(`No product with id: ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

export const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new NotFoundError(`No product with id: ${productId}`);
  }

  await product.remove(); //using it to invoke pre hook on ProductSchema

  res.status(StatusCodes.OK).json({ msg: "Success! Product removed!" });
};

export const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("No file uploaded!");
  }

  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload image");
  }

  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new BadRequestError("Please upload image smaller than 1MB");
  }

  const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);

  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};
