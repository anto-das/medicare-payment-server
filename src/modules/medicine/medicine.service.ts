import { Prisma } from "../../../generated/prisma/client";
import { MedicineWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getMedicine = async ({
  search,
  category_name,
  price,
}: {
  search: string | undefined;
  category_name: string | undefined;
  price: string | undefined;
}) => {
  // টাইপ সেফটির জন্য Prisma.MedicineWhereInput ব্যবহার করুন
  const filterCondition: Prisma.MedicineWhereInput[] = [];

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

  // // ৩. প্রাইস ফিল্টার (বাগ ফিক্সড)
  // if (price && !isNaN(Number(price))) {
  //   const clientPrice = new Prisma.Decimal(Number(price));
    
  //   // মার্জিন ফিক্সড করা হয়েছে (আপনার প্রয়োজন অনুযায়ী ০.৫ বা ১ করে নিতে পারেন)
  //   const margin = new Prisma.Decimal(0.5); 

  //   filterCondition.push({
  //     price: {
  //       gte: clientPrice.minus(margin),
  //       lte: clientPrice.plus(margin),
  //     },
  //   });
  // }

  // ৪. ডাটাবেজ কুয়েরি
  const result = await prisma.medicine.findMany({
    where: {
      AND: filterCondition,
    },
  });

  // ৫. রেসপন্স ফরম্যাটিং (Unused property বাদ দেওয়া)
  return result.map((item) => {
    const { category_id, ...res } = item;
    return res;
  });
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
