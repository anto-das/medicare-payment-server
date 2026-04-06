import { boolean } from "better-auth";
import dotenv from "dotenv";
import { prisma } from "../lib/prisma";
import { UserRole } from "../Types/roleCheck";
import bcrypt from "bcryptjs";
dotenv.config();

async function seedAdmin() {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME as string,
      email: process.env.ADMIN_EMAIL as string,
      password: process.env.ADMIN_PASS as string,
      role: UserRole.ADMIN,
      emailVerified: true,
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email as string,
      },
    });

    if (existingUser) {
      throw new Error("User Already Exist...!");
    }

    const signUpAdmin = await fetch(
      `${process.env.API_URL as string}/api/auth/sign-up/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      },
    );

    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }
  } catch (error) {
    console.log("seed admin error ", error);
  }
}

seedAdmin();
