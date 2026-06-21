import { Request, Response } from "express";
import { paymentService } from "./payment.service";
import status from "http-status";
import { stripe } from "../../config/stripe.config";

const handlePaymentController = async (req: Request, res: Response) => {
  try {
    const { medicines, order_id } = req.body;
    const customer_email = req.user?.email as string;
    const session = await paymentService.handlePayment(
      medicines,
      customer_email,
      order_id
    );
    res.status(status.CREATED).send(session);
  } catch (err: any) {
    console.log(err);
  }
};

const getSessionData = async (req: Request, res: Response) => {
  const { session_id } = req.query;

  if (!session_id || typeof session_id !== "string") {
    return res.status(400).send({
      success: false,
      message: "Session ID is missing or invalid in query parameters",
    });
  }

  const result = await paymentService.getSessionData(session_id);

  res.status(status.OK).send({
    success: true,
    message: "Retrieved payment session data successfully",
    data: result,
  });
};

const handleStripeWebhookController = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_KEY as string,
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  try {
    const result = await paymentService.handleStripeWebhookService(event);
    res.status(status.OK).send({
      success: true,
      message: "Stripe webhook event proceed successfully..",
      data: result,
    });
  } catch (err: any) {
    return res.status(status.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: "error handle stripe webhook event",
      error: err,
    });
  }
};

export const paymentController = {
  handlePaymentController,
  handleStripeWebhookController,
  getSessionData,
};
