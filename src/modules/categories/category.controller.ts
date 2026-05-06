import { NextFunction, Request, Response } from "express";
import { categoryService } from "./category.service";

const postCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = req.body;
    const result = await categoryService.postCategory(category);
    res.status(201).send({
      success: true,
      data: result,
    });
  } catch (e) {
    next(
      res.status(500).send({
        success: false,
        message: {
          "category post error": e,
        },
      }),
    );
  }
};

const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await categoryService.getAllCategories();
    res.status(200).send({
      success: true,
      message: "Retrieved all categories successfully..",
      data: result,
    });
  } catch (err) {
    next(
      res.status(500).send({
        success: true,
        message: err,
      }),
    );
  }
};

const deleteCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const result = await categoryService.deleteCategories(id as string);
    res.status(200).send({
      success: true,
      message: "Delete category successfully..",
      data: result,
    });
  } catch (err) {
    next(
      res.status(500).send({
        success: false,
        message: err,
      }),
    );
  }
};

export const categoryController = {
  postCategory,
  getAllCategories,
  deleteCategories,
};
