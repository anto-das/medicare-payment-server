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
    // console.log("body from seller controller: ",body);
    const sellerId = req.user?.id;
    const result = await sellerService.postMedicine(body, sellerId as string);
    res.status(200).send({
      success: true,
      message: "store medicine successfully...",
      data: result,
    });
  } catch (err) {
    console.log("error from seller controller: ", err);
    next(err);
  }
};

const getAllSellerMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.user?.id as string;
    const result = await sellerService.getAllSellerMedicines(id);
    res.status(200).send({
      success: true,
      message: "Retrieved all medicine successfully..",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const getSellerSingleOrders = async (
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

const getDayWiseWeeklyRevenue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const seller_id = req.user?.id;
    const result = await sellerService.getDayWiseWeeklyRevenue(
      seller_id as string,
    );
    res.status(200).send({
      success: true,
      message: "retrieved last week revenue  successfully..",
      data: result,
    });
  } catch (error: any) {
    next(error);
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
    // console.log("param id from seller controller: ", id);
    const body = req.body;
    // console.log("req body from seller controller: ", body);
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

const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const result = await sellerService.deleteOrder(id as string);
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
  getAllSellerMedicines,
  getSellerOrders,
  updateOrderStatus,
  updatedMedicine,
  deleteMedicine,
  getSellerSingleOrders,
  getDayWiseWeeklyRevenue,
  deleteOrder,
};
