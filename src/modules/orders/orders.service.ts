import { Orders } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../Types/roleCheck";

const createOrders = async (
  data: Omit<
    Orders,
    "order_id" | "status" | "order_date" | "customer_email"
  > & {
    orderItems: {
      medicine_id: string;
      quantity: number;
      price: string | number;
    }[];
  },
  customer_email: string,
) => {
  const { total_bill, orderItems } = data;
  const result = await prisma.$transaction(async (tx) => {
    const sellerIds = await Promise.all(
      orderItems.map(async (item) => {
        return await tx.medicine.findUnique({
          where: {
            medicine_id: item.medicine_id,
          },
          select: {
            seller_id: true,
          },
        });
      }),
    );

    for (const sellerId of sellerIds) {
      if (!sellerId) continue;
      const order = await tx.orders.create({
        data: {
          customer_email: customer_email,
          total_bill: Number(data.total_bill),
          seller_id: sellerId?.seller_id as string,
        },
      });
      // console.log("order:  ", order);
      await tx.order_item.createMany({
        data: data.orderItems.map((item) => ({
          order_id: order.order_id,
          medicine_id: item.medicine_id,
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
      });
      return await tx.orders.findUnique({
        where: { order_id: order.order_id },
        include: { orderItems: true },
      });
    }
  });
  return result;
};

const getAllOrders = async (email: string, role: UserRole) => {
  if (role === UserRole.ADMIN) {
    return await prisma.orders.findMany({
      include: {
        orderItems: true,
      },
    });
  }
  return await prisma.orders.findMany({
    where: {
      customer_email: email,
    },
    include: {
      orderItems: {
        select: {
          item_id: true,
          order_id: true,
          quantity: true,
          price: true,
        },
      },
    },
  });
};

const getSingleOrder = async (order_id: string) => {
  return await prisma.orders.findUnique({
    where: {
      order_id,
    },
    include: {
      orderItems: true,
    },
  });
};
const getFirstOrder = async (email: string) => {
  console.log("get first email from order service: ", email);
  return await prisma.orders.findFirst({
    where: {
      customer_email: email,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      order_id: true,
    },
  });
};

// const updateOrder = async (order_id: string, data: any) => {
//   return await prisma.$transaction(async (tx) => {
//     await tx.orders.update({
//       where: {
//         order_id,
//       },
//       data: {
//         total_bill: data.total_bill,
//       },
//     });

//     await Promise.all(
//       data.orderItems.map((item: any) => {
//         return tx.order_item.update({
//           where: { item_id: item.item_id },
//           data: {
//             order_quantity: item.order_quantity,
//             price: Number(item.price),
//           },
//         });
//       }),
//     );

//     return await prisma.orders.findUnique({
//       where: { order_id },
//       include: {
//         orderItems: {
//           select: {
//             order_id: true,
//             order_quantity: true,
//             price: true,
//           },
//         },
//       },
//     });
//   });
// };

// const deleteOrder = async (id: string) => {
//   const result = await prisma.orders.delete({
//     where: {
//       order_id: id,
//     },
//   });
//   return result;
// };

export const orderService = {
  createOrders,
  getFirstOrder,
  getAllOrders,
  getSingleOrder,
  // updateOrder,
  // deleteOrder,
};
