import { prisma } from "../../lib/prisma";

const postCategory = async (payload: {
  category_type: string;
  category_description: string;
}) => {
  const result = await prisma.$transaction(async (tx) => {
    const existingCat = await tx.categories.findFirst({
      where: {
        category_type: payload.category_type,
      },
    });
    if (existingCat) {
      return existingCat;
    }
    return await tx.categories.create({
      data: { ...payload },
    });
  });
  return result;
};

const getAllCategories = async () => {
  const result = prisma.categories.findMany();
  return result;
};

const deleteCategories = async (id: string) => {
  return await prisma.categories.delete({
    where: {
      category_id: id,
    },
  });
};

export const categoryService = {
  postCategory,
  getAllCategories,
  deleteCategories,
};
