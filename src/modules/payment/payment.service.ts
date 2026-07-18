import Stripe from "stripe";
import { Cart } from "../../../generated/prisma/client";
import { stripe } from "../../config/stripe.config";
import { prisma } from "../../lib/prisma";


const handlePayment = async (
  carts: Cart[],
  customer_email: string,
  order_id: string,
): Promise<Stripe.Checkout.Session> => {
  const lineItems = carts.map((medicine) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: medicine.medicine_name,
        images: [medicine.medi_img],
      },
      unit_amount: Math.round(Number(medicine.price) * 100),
    },
    quantity: medicine.quantity,
  }));

  const orderedItems = carts.map((medicine) => ({
    medicine_id: medicine.medicine_id,
    quantity: medicine.quantity,
    price: Number(medicine.price),
  }));
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 60 * 100,
            currency: "usd",
          },
          display_name: "Home Delivery",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 1 },
            maximum: { unit: "business_day", value: 3 },
          },
        },
      },
    ],
    metadata: {
      orderedItems: JSON.stringify(orderedItems),
      customer_email: customer_email,
      order_id: order_id,
    },
    mode: "payment",
    success_url:
      `${process.env.APP_URL}/cart/checkout/success?session_id=` +
      "{CHECKOUT_SESSION_ID}",
    cancel_url: `${process.env.APP_URL}/cart/checkout/cancel`,
  });
  return session;
};

const getSessionData = async (session_id: string): Promise<any> => {
  const session = await stripe.checkout.sessions.retrieve(session_id);
  const sessionData = {
    id: session.id.slice(-10),
    amount: Number(session.amount_total) / 100,
    status: session.status,
  };

  return sessionData;
};

const handleStripeWebhookService = async (event: Stripe.Event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id,
    },
  });

  if (existingPayment) {
    return { message: `Event ${event.id} already processed. Skipping` };
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const { metadata } = session;
      const parseOrderedItems = JSON.parse(metadata!.orderedItems!);
      const customer_email = metadata!.customer_email;
      const order_id = metadata!.order_id;
      await prisma.$transaction(async (tx) => {
        const order = await tx.orders.update({
          where: {
            order_id: order_id as string,
          },
          data: {
            payment_status:
              session.payment_status === "paid" ? "PAID" : "UNPAID",
          },
        });
        const user = await tx.user.findUnique({
          where: { email: customer_email as string },
        });
        if (!user) {
          return "user not found";
        }
        const storePaymentInfo = await tx.payment.create({
          data: {
            name: user.name as string,
            user_email: user.email as string,
            amount: Number(session.amount_total),
            transactionId: session.payment_intent as string,
            stripeEventId: event.id,
            orderId: order_id as string,
          },
        });
      });
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

export const paymentService = {
  handlePayment,
  getSessionData,
  handleStripeWebhookService,
};
