import { NextFunction, Request, Response } from "express";
import status from "http-status";

// const handlerStripeWebhookEvent = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const signature = req.headers["stripe-signature"] as string;
//   const webhookSecret = process.env.STRIPE_WEBHOOK_KEY;
//   if (!signature || !webhookSecret) {
//     console.log("missing stripe signature or web hook secret");
//     res
//       .status(status.BAD_REQUEST)
//       .json({ message: "error processing stripe webhook" });
//   }
//   let event;
//   try {
    
//   } catch (error:any) {
    
//   }
// };
