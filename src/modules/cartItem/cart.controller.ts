import { NextFunction, Request, Response } from "express";
import { cartService } from "./cart.service";

const createCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await cartService.createCart(req.body);
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
    const result = await cartService.getCartItems();
    res.status(200).send({
      success: true,
      message: "retrieved all data successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
    console.log(err);
  }
};

export const cartItemController = {
  createCartItem,
  getCartItems,
};
