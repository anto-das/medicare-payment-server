/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";

import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../../generated/prisma/enums";

const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id,
    },
  });

  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return { message: `Event ${event.id} already processed. Skipping` };
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      const orderId = session.metadata?.orderId;

      const paymentId = session.metadata?.paymentId;

      if (!orderId || !paymentId) {
        console.error("Missing orderId or paymentId in session metadata");
        return {
          message: "Missing orderId or paymentId in session metadata",
        };
      }

      const orders = await prisma.orders.findUnique({
        where: {
          order_id: orderId,
        },
      });

      if (!orders) {
        console.error(`orders with id ${orderId} not found`);
        return { message: `orders with id ${orderId} not found` };
      }

      await prisma.$transaction(async (tx) => {
        await tx.orders.update({
          where: {
            order_id: orderId,
          },
          data: {
            payment_status:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
          },
        });

        await tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            stripeEventId: event.id,
            status:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
            paymentGatewayData: session as any,
          },
        });
      });

      console.log(
        `Processed checkout.session.completed for order ${orderId} and payment ${paymentId}`,
      );
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;

      console.log(
        `Checkout session ${session.id} expired. Marking associated payment as failed.`,
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;

      console.log(
        `Payment intent ${session.id} failed. Marking associated payment as failed.`,
      );
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { message: `Webhook Event ${event.id} processed successfully` };
};

export const PaymentService = {
  handlerStripeWebhookEvent,
};
