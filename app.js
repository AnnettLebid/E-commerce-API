import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import "express-async-errors";
import "dotenv/config.js";
import { connectDB } from "./db/connect.js";
import { notFound as notFoundMiddleware } from "./middleware/not-found.js";
import { errorHandlerMiddleware } from "./middleware/error-handler.js";
import authRouter from "./routes/authRoutes.js";

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRouter);

const port = process.env.PORT || 5001;

app.use(morgan("tiny"));
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.use(cookieParser(process.env.JWT_SECRET));

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
