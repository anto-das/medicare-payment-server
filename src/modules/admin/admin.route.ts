import { Router } from "express";
import { adminController } from "./admin.controller";
import roleCheckerAuth from "../../middleware/auth";
import { UserRole } from "../../Types/roleCheck";

const route: Router = Router();

route.get("/users", roleCheckerAuth(UserRole.ADMIN), adminController.getUsers);
route.get(
  "/sellers",
  roleCheckerAuth(UserRole.ADMIN),
  adminController.getSellers,
);
route.patch(
  "/users/:id",
  roleCheckerAuth(UserRole.ADMIN),
  adminController.updateUserStatus,
);
route.patch(
  "/sellers/:id",
  roleCheckerAuth(UserRole.ADMIN),
  adminController.updateApprovalStatus,
);

export const adminRouter = route;
