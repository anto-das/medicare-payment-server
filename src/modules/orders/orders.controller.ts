import { NextFunction, Request, Response } from "express";
import { orderService } from "./orders.service";
import { string } from "better-auth";
import { UserRole } from "../../Types/roleCheck";

const createOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // console.log(req.user)
    const result = await orderService.createOrders(
      req.body,
      req.user?.email as string,
    );
    res.status(200).send({
      success: true,
      message: "create orders successfully..",
      data: result,
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const result = await orderService.getAllOrders(
      req.user?.email as string,
      req.user?.role as UserRole,
    );
    // console.log(result);
    res.status(200).send({
      success: true,
      message: "Retrieved all orders data successfully..",
      data: result,
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: {
        "get all order error": e,
      },
    });
  }
};

const getSingleOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await orderService.getSingleOrder(id as string);
    res.status(200).send({
      success: true,
      message: "Retrieved data successfully get by id..",
      data: result,
    });
  } catch (e) {
    res.status(500).send({
      success: true,
      message: {
        "get single order error": e,
      },
    });
  }
};

// const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const id = req.params.id;
//     const result = await orderService.updateOrder(id as string, req.body);
//     res.status(200).send({
//       success: true,
//       message: "update your order successfully..",
//       data: result,
//     });
//   } catch (e) {
//     next(e);
//   }
// };

// const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const id = req.params.id;
//     const result = await orderService.deleteOrder(id as string);
//     res.status(200).send({
//       success: true,
//       data: result,
//     });
//   } catch (e) {
//     next(e);
//   }
// };

export const orderController = {
  createOrders,
  getAllOrders,
  getSingleOrder,
  // updateOrder,
  // deleteOrder,
};
