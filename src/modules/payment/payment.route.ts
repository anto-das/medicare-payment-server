import { Router } from "express";
import { paymentController } from "./payment.controller";
import roleCheckerAuth from "../../middleware/auth";
import { UserRole } from "../../Types/roleCheck";

const router: Router = Router();

router.post(
  "/",
  roleCheckerAuth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
  paymentController.handlePaymentController,
);

router.get("/payment", paymentController.getSessionData);

export const paymentRouter = router;
