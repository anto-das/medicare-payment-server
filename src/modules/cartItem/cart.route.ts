import { Router } from "express";
import { cartItemController } from "./cart.controller";
import roleCheckerAuth from "../../middleware/auth";
import { UserRole } from "../../Types/roleCheck";

const router: Router = Router();
router.post("/", cartItemController.createCartItem);
router.get("/", cartItemController.getCartItems);
router.delete("/", cartItemController.deleteAll);

export const cartRouter = router;
