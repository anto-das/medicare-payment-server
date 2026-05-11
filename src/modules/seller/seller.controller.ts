import { NextFunction, Request, Response } from "express";
import { sellerService } from "./seller.service";
import { success } from "better-auth";
import { Status } from "../../../generated/prisma/enums";

const postMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body;
    const sellerId = req.user?.id;
    const result = await sellerService.postMedicine(body, sellerId as string);
    res.status(200).send({
      success: true,
      message: "store medicine successfully...",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getSellerOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const seller_id = req.user?.id;
    const result = await sellerService.getSellerOrders(seller_id as string);
    res.status(200).send({
      success: true,
      message: "Retrieved your orders successfully..",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const seller_id = req.params.id;
    const status = req.body.status;
    const result = await sellerService.updateOrderStatus(
      seller_id as string,
      status,
    );
    res.status(201).send({
      success: true,
      message: "status updated successfully..",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const updatedMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const result = await sellerService.updatedMedicine(id as string, body);
    res.status(201).send({
      success: true,
      message: "updated your defined medicine successfully...",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const deleteMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const result = await sellerService.deleteMedicine(id as string);
    res.status(200).send({
      success: true,
      message: "Medicine deleted successfully..",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export const sellerController = {
  postMedicine,
  getSellerOrders,
  updateOrderStatus,
  updatedMedicine,
  deleteMedicine,
};
