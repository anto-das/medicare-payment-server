import { Router } from "express";
import { sellerController } from "./seller.controller";
import { UserRole } from "../../Types/roleCheck";
import roleCheckerAuth from "../../middleware/auth";

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

export const sellerRouter = router;
