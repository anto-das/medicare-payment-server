import { prisma } from "../../lib/prisma";

const createReview = async (payload: {
  review_id: string;
  customer_email: string;
  order_id: string;
  user_location: string;
  rating: number;
  comment: string;
}) => {
  const existingUserReview = await prisma.reviews.findFirst({
    where: {
      customer_email: payload.customer_email,
      orderId: payload.order_id,
    },
  });
  if (existingUserReview) {
    throw new Error("User has already submitted a review for this order.");
  }
  const result = await prisma.reviews.create({
    data: {
      review_id: payload.review_id,
      customer_email: payload.customer_email,
      orderId: payload.order_id,
      user_location: payload.user_location,
      rating: payload.rating,
      comment: payload.comment,
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
