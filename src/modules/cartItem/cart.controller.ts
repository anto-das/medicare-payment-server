import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { cartService } from "./cart.service";

const createCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body.email = req.user?.email;
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

export const cartItemController = {
  createCartItem,
};
