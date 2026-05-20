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
      customer_email,
      customer_name,
      order_id,
      user_location,
      rating,
      comment,
      seller_id,
    } = req.body;
    // console.log("req body from review controller: ", customer_email,customer_name);
    const result = await reviewService.createReview({
      customer_name,
      customer_email,
      order_id,
      user_location,
      rating,
      comment,
      seller_id,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({ message: error.message });
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
