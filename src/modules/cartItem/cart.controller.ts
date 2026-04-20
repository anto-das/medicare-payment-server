import { NextFunction, Request, Response } from "express";
import { cartService } from "./cart.service";

const createCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, guest_id, user_id } = req.body;

    const result = await cartService.createCart({ id, user_id, guest_id });
    res.status(200).send({
      success: true,
      message: "added cart item successfully..",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCartItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: { user_id: string; guest_id: string } = {
      user_id: req.body?.user?.id as string,
      guest_id: req.body?.guest_id as string,
    };
    const result = await cartService.getCartItems(payload);
    res.status(200).send({
      success: true,
      message: "retrieved all data successfully",
      data: result,
    });
  } catch (err: any) {
    console.log("get cart error what's the error: ", err);
    next(err);
  }
};

const deleteAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryName = req.body.category_name;

    const result = await cartService.deleteAll(categoryName);
    res.status(200).send({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const cartItemController = {
  createCartItem,
  getCartItems,
  deleteAll,
};
