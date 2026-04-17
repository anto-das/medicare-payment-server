import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let errorMessage = "Internal server error..";
  let errDetails = err;

  // console.log("global errorrrrr*********", err);

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provide incorrect type or missing fields";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed on the field!";
    } else if (err.code === "P2025") {
      statusCode = 400;
      errorMessage =
        "An operation failed because it depends on one or more records that were required but not found";
    } else if (err.code === "P2028") {
      statusCode = 500;
      errorMessage = "Internal server error";
    }
  }
  res.status(statusCode);
  res.send({
    message: errorMessage,
    error: errDetails,
  });
}

export default globalErrorHandler;
