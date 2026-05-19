import { NextFunction, Request, Response } from "express";
import { medicineService } from "./medicine.service";

const getMedicine = async (req: Request, res: Response) => {
  const { search, category_name, price } = req.query;
  const searchStr = typeof search === "string" ? search : undefined;
  const categoryNameStr =
    typeof category_name === "string" ? category_name : undefined;

  const priceStr = typeof price === "string" ? price : undefined;
  const result = await medicineService.getMedicine({
    search: searchStr,
    category_name: categoryNameStr,
    price: priceStr,
  });
  res.status(200).send({
    success: true,
    message: "medicine retrieved successfully..",
    data: result,
  });
};

const getSingleMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const result = await medicineService.getSingleMedicine(id as string);
    if (result === null) {
      return res.status(404).send({
        success: false,
        message: "This medicine not found in our stock..",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Retrieved the medicine detail successfully..",
        data: result,
      });
    }
  } catch (e) {
    res.status(500).send({
      success: false,
      message: {
        "single medicine err": e,
      },
    });
  }
};

export const medicineController = {
  getMedicine,
  getSingleMedicine,
};
