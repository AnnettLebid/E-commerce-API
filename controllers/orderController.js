import StatusCodes from "http-status-codes";
import { Review } from "../models/Review.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { checkPermissions } from "../utils/index.js";
import {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} from "../errors/index.js";

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

export const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError("No cart items provided");
  }

  if (!tax || !shippingFee) {
    throw new BadRequestError("Please provide tax and shipping fee!");
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new NotFoundError(`No product with id: ${item.product}`);
    }

    const { name, price, image, _id } = dbProduct;
    console.log(name, price, image, _id);
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    orderItems = [...orderItems, singleOrderItem]; //add to order
    subtotal += item.amount * price;
  }
  const total = tax + shippingFee + subtotal;

  //get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems,
    tax,
    total,
    subtotal,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

export const getAllOrders = async (req, res) => {
  res.send("getAllOrders");
};

export const getSingleOrder = async (req, res) => {
  res.send("getSingleOrder");
};

export const updateOrder = async (req, res) => {
  res.send("updateOrder");
};

export const getCurrentUserOrders = async (req, res) => {
  res.send("getCurrentUserOrders");
};
