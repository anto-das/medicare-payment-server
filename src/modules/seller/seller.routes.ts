import { Router } from "express";
import { sellerController } from "./seller.controller";

import roleCheckerAuth from "../../middleware/auth";
import { UserRole } from "../../Types/roleCheck";

const router: Router = Router();

router.post(
  "/medicine",
  roleCheckerAuth(UserRole.ADMIN, UserRole.SELLER),
  sellerController.postMedicine,
);

router.get(
  "/medicine",
  roleCheckerAuth(UserRole.SELLER),
  sellerController.getAllSellerMedicines,
);

router.get(
  "/orders",
  roleCheckerAuth(UserRole.SELLER),
  sellerController.getSellerOrders,
);

router.get(
  "/revenue/day-wise",
  roleCheckerAuth(UserRole.SELLER),
  sellerController.getDayWiseWeeklyRevenue,
);

router.patch(
  "/orders/:id",
  roleCheckerAuth(UserRole.SELLER),
  sellerController.updateOrderStatus,
);

router.put(
  "/medicine/:id",
  roleCheckerAuth(UserRole.ADMIN, UserRole.SELLER),
  sellerController.updatedMedicine,
);

router.delete(
  "/:id",
  roleCheckerAuth(UserRole.ADMIN, UserRole.SELLER),
  sellerController.deleteMedicine,
);
router.delete(
  "/delete/:id",
  roleCheckerAuth(UserRole.ADMIN, UserRole.SELLER),
  sellerController.deleteOrder,
);

export const sellerRouter = router;
