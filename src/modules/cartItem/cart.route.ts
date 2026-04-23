import { Router } from "express";
import { cartItemController } from "./cart.controller";

const router: Router = Router();
router.post("/", cartItemController.createCartItem);
router.get("/", cartItemController.getCartItems);
router.patch("/update", cartItemController.updateCart);
router.delete("/delete/:id", cartItemController.deleteSingleData);
router.delete("/delete", cartItemController.deleteAll);

export const cartRouter = router;
