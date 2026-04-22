import { prisma } from "../../lib/prisma";

const createCart = async (payload: {
  id: string;
  user_id?: string;
  guest_id?: string;
}) => {
  const result = await prisma.$transaction(
    async (tx) => {
      const medicine = await tx.medicine.findUnique({
        where: { medicine_id: payload.id as string },
      });

      if (!medicine) {
        throw new Error("Medicine not found");
      }

      const cartItem = await tx.cart.create({
        data: {
          medicine_id: medicine.medicine_id,
          medicine_name: medicine.medicine_name,
          generic_name: medicine.generic_name,
          manufacturer: medicine.manufacturer,
          medi_img: medicine.medi_img || "", // fallback value
          price: Number(medicine.price),
          category_name: medicine.category_name,
          user_id: payload.user_id as string,
          guest_id: payload.guest_id as string,
        },
      });
      // console.log("cart item: ", cartItem);
      return cartItem;
    },
    { maxWait: 5000, timeout: 10000 },
  );
  return result;
};

const getCartItems = async (payload: {
  user_id?: string | null;
  guest_id: string | null;
}) => {
  const result = await prisma.$transaction(
    async (tx) => {
      if (payload.user_id && payload.guest_id) {
        await tx.cart.updateMany({
          where: { guest_id: payload.guest_id },
          data: {
            user_id: payload.user_id,
            guest_id: null,
          },
        });
      }

      const cartItems = await tx.cart.findMany({
        where: payload.user_id
          ? { user_id: payload.user_id }
          : { guest_id: payload.guest_id },
      });

      return cartItems;
    },
    {
      maxWait: 5000,
      timeout: 10000,
    },
  );

  return result;
};

const updateCart = async (id: string, quantity: number) => {
  const result = await prisma.cart.update({
    where: {
      cart_id: id,
    },
    data: {
      quantity: quantity,
    },
  });
  return result;
};

const deleteAll = async (category_name: string) => {
  const result = await prisma.cart.deleteMany({
    where: {
      category_name,
    },
  });
  return result;
};
export const cartService = {
  createCart,
  getCartItems,
  updateCart,
  deleteAll,
};
