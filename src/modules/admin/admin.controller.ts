import { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";
import { success } from "better-auth";
import { User } from "../../../generated/prisma/client";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.getUsers();
    res.status(200).send({
      success: true,
      message: "Retrieved all users successfully..",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};
const getSellers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.getSellers();
    if (result === 404) {
      res.status(404).send({
        message: "Seller medicine is not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Retrieved all users successfully..",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    const result = await adminService.updateUserStatus(userId as string, data);
    res.status(201).send({
      success: true,
      message: "Status updated successfully...",
      data: result,
    });
  } catch (e: any) {
    // console.log("error picked...***...",e)
    next(e);
  }
};

export const adminController = {
  getUsers,
  getSellers,
  updateUserStatus,
};
