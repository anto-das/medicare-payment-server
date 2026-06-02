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
  const filterCondition: MedicineWhereInput[] = [];

  if (search) {
    filterCondition.push({
      OR: [
        {
          medicine_name: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          manufacturer: {
            contains: search as string,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (category_name) {
    filterCondition.push({
      category_name: {
        contains: category_name as string,
        mode: "insensitive",
      },
    });
  }
  const clientPrice = new Prisma.Decimal(Number(price));
  const margin = new Prisma.Decimal(0.5 | 0.7 | 1);

  if (price) {
    filterCondition.push({
      price: {
        gte: clientPrice.minus(margin),
        lte: clientPrice.plus(margin),
      },
    });
  }

  const result = await prisma.medicine.findMany({
    where: {
      AND: filterCondition,
    },
  });
  return result.map((item) => {
    const { categoryId, ...res } = item;
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
