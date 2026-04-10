import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
import { status } from "../Types/status";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  // port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// If your Prisma file is located elsewhere, you can change the path
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL! || "http://localhost:3000"],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: true,
      },
      status: {
        type: "string",
        defaultValue: status.ACTIVE,
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false, //defaults to true
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Medi-store" <medi@store.com>',
          to: user.email,
          subject: "Verify Your Identity - Medi Store",
          text: "Thanks for signing up with Medi Store. Please verify your email using the link provided.",
          html: `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Medi Store Email Verification</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          background-color: #f4f7f9;
          margin: 0;
          padding: 0;
        }
        .email-wrapper {
          width: 100%;
          background-color: #f4f7f9;
          padding: 40px 0;
        }
        .email-content {
          max-width: 600px;
          margin: auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }
        .header {
          background: #3C693B; /* Solid Blue */
          padding: 20px;
          text-align: center;
          color: #fff;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .body {
          padding: 30px;
          text-align: center;
        }
        .body h2 {
          color: #333;
          margin-bottom: 15px;
        }
        .body p {
          color: #555;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 25px;
        }
        .verify-btn {
          display: inline-block;
          padding: 14px 30px;
          background: #3C693B; /* Solid Blue */
          color: #fff !important;
          text-decoration: none;
          font-weight: bold;
          border-radius: 8px;
          font-size: 16px;
          transition: background 0.3s ease;
        }
        .verify-btn:hover {
          background: #3C693B; /* Darker Blue on hover */
        }
        .footer {
          background: #fafafa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-content">
          <div class="header">
            <h1>Medi Store</h1>
          </div>
          <div class="body">
            <h2>Email Verification Required</h2>
            <p>Thank you for joining Medi Store! To activate your account, please verify your email address by clicking the button below.</p>
            <a href="${verificationUrl}" class="verify-btn">Verify My Email</a>

          </div>
          <div class="footer">
            <p>If you didn’t create a Medi Store account, you can safely ignore this email.</p>
          </div>
        </div>
      </div>
    </body>
  </html>
  `,
        });

        console.log("Message sent: %s", info.messageId);
      } catch (err) {
        console.error("Error while sending mail", err);
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET_ID as string,
      accessType: "offline",
      prompt: "select_account consent",
    },
  },
});
