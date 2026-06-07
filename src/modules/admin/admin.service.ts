import { ApprovalStatus, User } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../Types/roleCheck";

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
          status: "DELIVERED",
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
export const adminService = {
  getUsers,
  getSellers,
  updateUserStatus,
  updateApprovalStatus,
  updateUserRole,
};
