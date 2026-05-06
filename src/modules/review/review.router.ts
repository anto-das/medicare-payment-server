import { Router } from "express";
import { reviewController } from "./review.controller";
import roleCheckerAuth from "../../middleware/auth";
import { UserRole } from "../../Types/roleCheck";

export const router: Router = Router();

router.post(
  "/",
  roleCheckerAuth(UserRole.CUSTOMER),
  reviewController.createReview,
);
router.get("/", reviewController.getAllReviews);

export const reviewRouter = router;
