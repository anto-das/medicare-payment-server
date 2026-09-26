import { ApprovalStatus, User } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../types/roleCheck";

const getUsers = async () => {
  const result = await prisma.user.findMany();
  return result;
};

const getSellers = async () => {
  const sellers = await prisma.user.findMany({
    where: {
      role: UserRole.SELLER,
    },
  });
  if (sellers.length === 0) {
    return 404;
  }
  const result = await prisma.$transaction(async (tx) => {
    const sellersProducts = sellers.map((seller) =>
      tx.medicine.findMany({
        where: {
          seller_id: seller.id,
        },
      }),
    );
    const revenuePromises = sellers.map((seller) => {
      return tx.orders.groupBy({
        by: ["seller_id"],
        where: {
          seller_id: seller.id,
          payment_status: "PAID",
        },
        _sum: {
          total_bill: true,
        },
      });
    });
    const sellerMedicine = await Promise.all(sellersProducts);
    const revenue = await Promise.all(revenuePromises);
    return { sellerMedicine, revenue };
    // const findMedicines = seller
  });
  const revenueObj = result.revenue[0]?.map((item) => ({
    seller_id: item.seller_id,
    total_revenue: item._sum.total_bill,
  }));

  return {
    sellers,
    total_medicine: result.sellerMedicine[0]?.length,
    total_revenue: revenueObj?.[0]?.total_revenue ?? 0,
  };
};

const updateUserStatus = async (userId: string, data: User) => {
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: data.status,
    },
  });
  return result;
};

const updateApprovalStatus = async (
  medicineId: string,
  approval_status: ApprovalStatus,
) => {
  const result = await prisma.medicine.update({
    where: {
      medicine_id: medicineId,
    },
    data: {
      approval_status,
    },
  });
  return result;
};

const updateUserRole = async (email: string, role: UserRole) => {
  return await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      role,
    },
  });
};
const getDayWiseWeeklyRevenue = async () => {
  // Last 7 days filtering
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Raw SQL to extract the day name and sum the amount
  const result = await prisma.$queryRaw<
    { day_name: string; total_revenue: number }[]
  >`
    SELECT
      TO_CHAR(d.day_date, 'Dy') AS day_name,
      COALESCE(SUM(o.total_bill), 0)::FLOAT AS total_revenue
    FROM (
      SELECT generate_series(
        CURRENT_DATE - INTERVAL '6 days',
        CURRENT_DATE,
        INTERVAL '1 day'
      )::date AS day_date
    ) d
    LEFT JOIN "Orders" o
      ON o."createdAt" >= d.day_date
      AND o."createdAt" < d.day_date + INTERVAL '1 day'
      AND o.status = 'DELIVERED'
    GROUP BY d.day_date
    ORDER BY d.day_date;
  `;

  return result;
};
export const adminService = {
  getUsers,
  getSellers,
  updateUserStatus,
  updateApprovalStatus,
  updateUserRole,
  getDayWiseWeeklyRevenue
};
