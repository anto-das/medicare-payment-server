import { Router } from "express";
import { adminController } from "./admin.controller";
import roleCheckerAuth from "../../middleware/auth";
import { UserRole } from "../../types/roleCheck";

const route: Router = Router();

route.get("/users", roleCheckerAuth(UserRole.ADMIN), adminController.getUsers);
route.get(
  "/sellers",
  roleCheckerAuth(UserRole.ADMIN),
  adminController.getSellers,
);
route.get(
  "/day-wise/revenue",
  roleCheckerAuth(UserRole.ADMIN),
  adminController.getDayWiseWeeklyRevenue,
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
route.patch(
  "/update-role",
  roleCheckerAuth(UserRole.ADMIN),
  adminController.updateUserRole,
);

export const adminRouter = route;
