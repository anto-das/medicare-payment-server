import { Router } from "express";
import { cartItemController } from "./cart.controller";
import roleCheckerAuth from "../../middleware/auth";
import { UserRole } from "../../Types/roleCheck";

const router: Router = Router();
router.post(
  "/",
  roleCheckerAuth(UserRole.CUSTOMER),
  cartItemController.createCartItem,
);
router.get("/", cartItemController.getCartItems);

export const cartRouter = router;
