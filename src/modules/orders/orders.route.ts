import { Router } from "express";
import { orderController } from "./orders.controller";
import roleCheckerAuth from "../../middleware/auth";
import { UserRole } from "../../Types/roleCheck";

const router: Router = Router();

router.post(
  "/",
  roleCheckerAuth(UserRole.CUSTOMER),
  orderController.createOrders,
);
router.get(
  "/",
  roleCheckerAuth(UserRole.CUSTOMER, UserRole.ADMIN),
  orderController.getAllOrders,
);

router.get(
  "/getById:id",
  roleCheckerAuth(UserRole.CUSTOMER, UserRole.SELLER),
  orderController.getSingleOrder,
);

router.get(
  "/getFirst",
  roleCheckerAuth(UserRole.CUSTOMER),
  orderController.getFirstOrder,
);

// router.put(
//   "/:id",
//   roleCheckerAuth(UserRole.ADMIN, UserRole.SELLER),
//   orderController.updateOrder,
// );

// router.delete(
//   "/:id",
//   roleCheckerAuth(UserRole.CUSTOMER, UserRole.SELLER),
//   orderController.deleteOrder,
// );

export const orderRouter = router;
