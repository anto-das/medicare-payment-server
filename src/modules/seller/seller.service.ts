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
  const result = await prisma.medicine.create({
    data: {
      seller_id: seller_id,
      medicine_name: data.medicine_name as string,
      category_name: categoryName?.category_type as string,
      generic_name: data.generic_name as string,
      unit_type: data.unit_type as string,
      stock_quantity: data.stock_quantity,
      price: data.price,
      manufacturer: data.manufacturer as string,
      description: data.description as string,
      medi_img: data.medi_img,
      strength: data.strength,
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
      stock_quantity: Number(data.stock_quantity),
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

const getDayWiseWeeklyRevenue = async (id: string) => {
  // Last 7 days filtering
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Raw SQL to extract the day name and sum the amount
  const result = await prisma.$queryRaw<
    { day_name: string; total_revenue: number }[]
  >`
    SELECT 
      TRIM(TO_CHAR(d.day_date, 'Day')) AS day_name,
      COALESCE(SUM(o.total_bill), 0)::FLOAT AS total_revenue
    FROM (
      SELECT generate_series(
        ${sevenDaysAgo}::timestamp, 
        NOW()::timestamp, 
        '1 day'::interval
      )::date AS day_date
    ) d
    LEFT JOIN "Orders" o ON o."createdAt"::date = d.day_date 
      AND o.seller_id = ${id} 
      AND o.status = 'DELIVERED'
    GROUP BY d.day_date
    ORDER BY d.day_date ASC;
  `;

  return result;
};

const deleteOrder = async (id: string) => {
  const result = await prisma.orders.delete({
    where: {
      order_id: id,
    },
  });
  return result;
};

export const sellerService = {
  postMedicine,
  getAllSellerMedicines,
  getSellerOrders,
  updateOrderStatus,
  updatedMedicine,
  deleteMedicine,
  getDayWiseWeeklyRevenue,
  deleteOrder,
};
