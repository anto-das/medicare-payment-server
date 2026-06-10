import { toNodeHandler } from "better-auth/node";
import express, { Request, Response } from "express";
import { auth } from "./lib/auth";
import cors from "cors";
import { medicineRoute } from "./modules/medicine/medicine.routes";
import { sellerRouter } from "./modules/seller/seller.routes";
import dotenv from "dotenv";
import { adminRouter } from "./modules/admin/admin.route";
import { categoryRouter } from "./modules/categories/category.route";
import { userRouter } from "./modules/authentication/user.route";

import globalErrorHandler from "./middleware/globalErrorHandler";
import { cartRouter } from "./modules/cartItem/cart.route";
import cookieParser from "cookie-parser";
import { orderRouter } from "./modules/orders/orders.route";
import { reviewRouter } from "./modules/review/review.router";
dotenv.config();
const app = express();
app.use(cookieParser());

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    console.log("webhook received: ", req.body);
    res.status(200).json({ success: true });
  },
);

app.use(
  cors({
    origin: [process.env.APP_URL || "http://localhost:3000"],
    credentials: true,
  }),
);
app.all("/api/auth/*path", toNodeHandler(auth));
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello Medi Store....");
});

app.use("/api/own", userRouter);
app.use("/api/medicine", medicineRoute);
app.use("/api/cart", cartRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/category", categoryRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);

app.use((req: Request, res: Response) => {
  res.status(404).send({
    message: "route not found..",
    method: req.method,
    url: req.url,
  });
});

app.use(globalErrorHandler);

export default app;
