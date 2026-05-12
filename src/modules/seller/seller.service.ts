import { Prisma } from "../../../generated/prisma/client";
import { Status } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const postMedicine = async (data: any, seller_id: string) => {
  const categoryName = await prisma.categories.findUnique({
    where: {
      category_id: data.categoryId,
    },
    select: {
      category_type: true,
    },
  });
  console.log(categoryName?.category_type);
  const result = await prisma.medicine.create({
    data: {
      ...data,
      category_name: categoryName?.category_type,
      seller_id,
    },
  });
  return result;
};

const getAllSellerMedicines = async (seller_id: string) => {
  return await prisma.medicine.findMany({
    where: {
      seller_id,
    },
  });
};

const getSellerOrders = async (seller_id: string) => {
  return await prisma.orders.findMany({
    where: {
      seller_id,
    },
    include: {
      orderItems: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updatedMedicine = async (medicine_id: string, data: any) => {
  return await prisma.medicine.update({
    where: {
      medicine_id,
    },
    data: {
      ...data,
    },
  });
};

const updateOrderStatus = async (order_id: string, status: Status) => {
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.orders.findUnique({
      where: {
        order_id,
      },
    });
    // const {customer_email,seller_id,total_bill} = order;
    // console.log(order);
    // await tx.orders.upsert({
    //   where: {
    //     order_id,
    //   },
    //   update: {
    //     status,
    //   },
    //   create: {
    //     customer_email: order?.customer_email,
    //     seller_id: order?.seller_id as string,
    //     total_bill: order?.total_bill,
    //   },
    // });
    await tx.orders.upsert({
      where: { order_id },
      update: { status },
      create: {
        customer_email: order?.customer_email ?? "",
        seller_id: order?.seller_id ?? "",
        total_bill: order?.total_bill ?? new Prisma.Decimal(0),
        status,
      },
    });

    return await tx.orders.findFirst({
      where: {
        order_id,
      },
    });
  });
  return result;
};

const deleteMedicine = async (medicine_id: string) => {
  return await prisma.medicine.delete({
    where: {
      medicine_id,
    },
  });
};

export const sellerService = {
  postMedicine,
  getAllSellerMedicines,
  getSellerOrders,
  updateOrderStatus,
  updatedMedicine,
  deleteMedicine,
};
