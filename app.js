import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import "express-async-errors";
import "dotenv/config.js";
import { connectDB } from "./db/connect.js";
import { notFound as notFoundMiddleware } from "./middleware/not-found.js";
import { errorHandlerMiddleware } from "./middleware/error-handler.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import reviewRouter from "./routes/reviewRouter.js";
import orderRouter from "./routes/orderRouter.js";

const app = express();
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("/public"));
app.use(fileUpload());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

const port = process.env.PORT || 5001;

app.use(morgan("tiny"));
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (err) {
    console.log(err);
  }
};

start();
