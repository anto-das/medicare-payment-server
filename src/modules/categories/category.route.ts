import { Router } from "express";
import roleCheckerAuth from "../../middleware/auth";
import { UserRole } from "../../types/roleCheck";
import { categoryController } from "./category.controller";

const router: Router = Router();

router.post(
  "/",
  roleCheckerAuth(UserRole.ADMIN),
  categoryController.postCategory,
);
router.get("/", categoryController.getAllCategories);
router.delete(
  "/:id",
  roleCheckerAuth(UserRole.ADMIN),
  categoryController.deleteCategories,
);

export const categoryRouter = router;
