import { User } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../Types/roleCheck";

const getUsers = async () => {
  const result = await prisma.user.findMany();
  return result;
};

const updateUserStatus = async (userId: string, data: User) => {
  const result = await prisma.user.upsert({
    where: {
      id: userId,
    },
    update: {
      status: data.status,
    },
    create: {
      id: userId,
      email: data.email,
      name: data.name,
      status: data.status,
    },
  });
  return result;
};

export const adminService = {
  getUsers,
  updateUserStatus,
};
