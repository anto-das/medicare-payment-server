import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.user?.email;
    console.log(email);
    // console.log(req)
    const result = await userService.getMe(email as string);
    res.status(201).send({
      success: true,
      message: "Retrieved your info successfully..",
      data: result,
    });
  } catch (e: any) {
    next(
      res.status(500).send({
        success: false,
        message: e.message,
      }),
    );
  }
};

export const userController = {
  getMe,
};
