import express from "express";
import morgan from "morgan";
import "express-async-errors";
import "dotenv/config.js";
import { connectDB } from "./db/connect.js";

const app = express();
app.use(express.json());

const port = process.env.PORT || 5001;

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
