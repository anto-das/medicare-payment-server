import { NextFunction, Request, Response } from "express";
import { cartService } from "./cart.service";

const createCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, guest_id, user_id, quantity } = req.body;
    const result = await cartService.createCart({
      id,
      user_id,
      guest_id,
      quantity,
    });
    res.status(201).send({
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
    const guest_id = req.query?.guest_id;
    const payload: { guest_id: string } = {
      guest_id: guest_id as string,
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

const updateCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.body.cart_id;
    const quantity = Number(req.body.quantity);
    const result = await cartService.updateCart(id, quantity);
    res.status(200).send({
      success: true,
      message: "update data successfully..",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSingleData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const result = await cartService.deleteSingleData(id);
    res.status(200).send({
      success: true,
      message: `${result.category_name} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guest_id = req.body?.payload.guest_id as string;
    // console.log(req.body);
    // console.log("guest id from cart controller: ", guest_id);
    const result = await cartService.deleteAll(guest_id);
    res.status(200).send({
      success: true,
      message: "deleted all data successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const cartItemController = {
  createCartItem,
  getCartItems,

  updateCart,
  deleteSingleData,
  deleteAll,
};
