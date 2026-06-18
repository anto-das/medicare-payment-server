import Stripe from "stripe";
import { Cart } from "../../../generated/prisma/client";
import { stripe } from "../../config/stripe.config";

const handlePayment = async (
  carts: Cart[],
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
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],

    // বামের 'line_items' স্ট্রাইপের ফিক্সড ফিল্ড, ডানের 'lineItems' আপনার বানানো ভেরিয়েবল
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

export const paymentService = {
  handlePayment,
  getSessionData,
};
