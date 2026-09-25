import { Prisma } from "../../../generated/prisma/client";
import { MedicineWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getMedicine = async ({
  search,
  category_name,
  skip,
  limit,
  page,
}: {
  search: string | undefined;
  category_name: string | undefined;
  skip: number;
  limit: number;
  page: number;
}) => {
  // টাইপ সেফটির জন্য Prisma.MedicineWhereInput ব্যবহার করুন
  const filterCondition: Prisma.MedicineWhereInput[] = [];
  // console.log("console.log from medicine service: ", { page, limit });
  // ১. সার্চ ফিল্টার
  if (search) {
    filterCondition.push({
      OR: [
        {
          medicine_name: {
            contains: search, // 'as string' বাদ দেওয়া হয়েছে
            mode: "insensitive",
          },
        },
        {
          manufacturer: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // ২. ক্যাটাগরি ফিল্টার
  if (category_name) {
    filterCondition.push({
      category_name: {
        contains: category_name,
        mode: "insensitive",
      },
    });
  }

  // ৪. ডাটাবেজ কুয়েরি
  const result = await prisma.medicine.findMany({
    take: limit,
    skip: skip,
    where: {
      AND: filterCondition,
    },
  });
  const getAllData = await prisma.medicine.count({
    where: {
      AND: filterCondition,
    },
  });
  // ৫. রেসপন্স ফরম্যাটিং (Unused property বাদ দেওয়া)
  const medicines = result.map((item) => {
    const { category_id, ...res } = item;

    return res;
  });
  return {
    medicines: medicines,
    pagination: {
      total: getAllData,
      page,
      limit,
      totalPage: Math.ceil(getAllData / limit),
    },
  };
};

const getSingleMedicine = async (medicine_id: string) => {
  const result = prisma.medicine.findUnique({
    where: {
      medicine_id,
    },
  });
  return result;
};

export const medicineService = {
  getMedicine,
  getSingleMedicine,
};
