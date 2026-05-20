import { prisma } from "../../lib/prisma";

const createReview = async (payload: {
  customer_email: string;
  customer_name: string;
  order_id: string;
  user_location: string;
  rating: number;
  comment: string;
  seller_id: string;
}) => {
  const existingUserReview = await prisma.reviews.findFirst({
    where: {
      customer_email: payload.customer_email,
      orderId: payload.order_id,
    },
  });
  if (existingUserReview) {
    const error: any = new Error(
      "User has already submitted a review for this order.",
    );
    error.statusCode = 400; // Bad Request
    throw error;
  }
  const result = await prisma.reviews.create({
    data: {
      customer_email: payload.customer_email,
      customer_name: payload.customer_name,
      orderId: payload.order_id,
      user_location: payload.user_location,
      rating: payload.rating,
      comment: payload.comment,
      seller_id: payload.seller_id,
    },
  });
  return result;
};

const getAllReviews = async () => {
  const reviews = await prisma.reviews.findMany();
  return reviews;
};

export const reviewService = {
  createReview,
  getAllReviews,
};
