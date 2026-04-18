import { prisma } from "../../lib/prisma";

const createCart = async (id: string) => {
  const result = await prisma.$transaction(
    async (tx) => {
      const medicine = await tx.medicine.findUnique({
        where: { medicine_id: id },
      });

      if (!medicine) {
        throw new Error("Medicine not found");
      }

      const existingCartItem = await tx.cart.findFirst({
        where: { medicine_id: medicine.medicine_id },
      });

      if (existingCartItem) {
        return new Error("cart item is already exist");
      }

      return await tx.cart.create({
        data: {
          medicine_id: medicine.medicine_id,
          medicine_name: medicine.medicine_name,
          generic_name: medicine.generic_name,
          manufacturer: medicine.manufacturer,
          medi_img: medicine.medi_img || "", // fallback value
          price: Number(medicine.price),
          category_name: medicine.category_name,
          //   quantity: payload.quantity,
        },
      });
    },
    { maxWait: 2000, timeout: 50000 },
  );

  return result;
};

const getCartItems = async () => {
  const result = await prisma.cart.findMany();
  return result;
};
export const cartService = {
  createCart,
  getCartItems,
};
