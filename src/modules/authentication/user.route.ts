import { Router } from "express";
import { userController } from "./user.controller";
import roleCheckerAuth from "../../middleware/auth";
import { UserRole } from "../../types/roleCheck";


const router: Router = Router();

router.get(
  "/profile",
  roleCheckerAuth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SELLER),
  userController.getMe,
);

export const userRouter = router;
