import { Request, Response } from "express";
import { paymentService } from "./payment.service";
import status from "http-status";

const handlePaymentController = async (req: Request, res: Response) => {
  try {
    const { medicines } = req.body;
    const session = await paymentService.handlePayment(medicines);
    res.status(status.CREATED).send(session);
  } catch (err: any) {
    console.log(err);
  }
};

const getSessionData = async (req: Request, res: Response) => {
  const { session_id } = req.query;
  const result = await paymentService.getSessionData(session_id as string);
  res.status(status.OK).send({
    success: true,
    message: "Retrieved payment session data successfully",
    data: result,
  });
};

export const paymentController = {
  handlePaymentController,
  getSessionData,
};
