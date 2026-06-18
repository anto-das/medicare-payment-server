import { Router } from "express";
import { paymentController } from "./payment.controller";

const router: Router = Router();

router.post("/", paymentController.handlePaymentController);

router.get("/payment", paymentController.getSessionData);

export const paymentRouter = router;
