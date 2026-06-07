import { boolean } from "better-auth";
import dotenv from "dotenv";
import { prisma } from "../lib/prisma";
import { UserRole } from "../Types/roleCheck";
import bcrypt from "bcryptjs";
import { role } from "better-auth/plugins";
import { auth } from "../lib/auth";
dotenv.config();

async function seedAdmin() {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME || "medi store",
      email: process.env.ADMIN_EMAIL || "admin@medi-store.com",
      password: process.env.ADMIN_PASS || "########",
      role: UserRole.ADMIN,
      emailVerified: false,
    };

    // console.log("admin data ", adminData);

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email as string,
      },
    });

    if (existingUser) {
      throw new Error("User Already Exist...!");
    }

    const signUpAdmin = await auth.api.signUpEmail({
      body: adminData,
    });

    // console.log("admin sign up response ", signUpAdmin);

    if (signUpAdmin.user.id) {
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
    console.error("Error seeding admin user:", error);
  }
}

seedAdmin();
