import { NextFunction, Request, Response } from "express";
import { reviewService } from "./review.service";

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Implementation for creating a new review
  try {
    const {
      review_id,
      customer_email,
      order_id,
      user_location,
      rating,
      comment,
    } = req.body;

    const result = await reviewService.createReview({
      review_id,
      customer_email,
      order_id,
      user_location,
      rating,
      comment,
    });
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await reviewService.getAllReviews();
    res.status(200).send({
      success: true,
      message: "Retrieved all reviews successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const reviewController = {
  createReview,
  getAllReviews,
};
