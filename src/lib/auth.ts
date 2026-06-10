import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

import { oAuthProxy } from "better-auth/plugins";
import { status } from "../types/status";

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

  emailAndPassword: {
    enabled: true,
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
          html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Medi Store Account</title>
    <style>
      /* Smooth Animation Keyframes */
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulseRing {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(60, 105, 59, 0.4); }
        70% { transform: scale(1); box-shadow: 0 0 0 12px rgba(60, 105, 59, 0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(60, 105, 59, 0); }
      }
      @keyframes floatIcon {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-4px); }
        100% { transform: translateY(0px); }
      }

      /* Global resets for best client support */
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important; }
      img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }

      /* Responsive rules */
      @media screen and (max-width: 600px) {
        .email-content { width: 100% !important; max-width: 100% !important; border-radius: 0px !important; }
        .body-padding { padding: 30px 20px !important; }
      }
    </style>
  </head>
  <body style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; background-color: #f4f7f9; margin: 0; padding: 0; width: 100%;">

    <!-- Outer Wrapper Table -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7f9; padding: 40px 0 60px 0;">
      <tr>
        <td align="center">
          
          <!-- Card Container -->
          <table border="0" cellpadding="0" cellspacing="0" class="email-content" width="600" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #eef2f5; animation: fadeIn 0.6s ease-out forwards;">
            
            <!-- Secure Top Feature Bar -->
            <tr>
              <td style="background-color: #f8fafc; padding: 12px 30px; border-bottom: 1px solid #edf2f7; text-align: left;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="font-size: 11px; color: #718096; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                      🔒 Secure Medical Portal Verification
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Header Section with Brand Colors -->
            <tr>
              <td class="body-padding" style="padding: 40px 40px 20px 40px; text-align: center;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center">
                      <!-- Brand Title with Health Icon -->
                      <h1 style="margin: 0; font-size: 28px; color: #3C693B; font-weight: 800; tracking-tight: -0.5px; display: inline-block;">
                        <span style="vertical-align: middle; margin-right: 6px;">🛡️</span>Medi Store
                      </h1>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Main Interactive Body Contents -->
            <tr>
              <td class="body-padding" style="padding: 0 40px 40px 40px; text-align: center;">
                
                <!-- Animated Security Check Mark Banner -->
                <div style="margin: 20px auto 30px auto; width: 72px; height: 72px; background-color: #f0f7f0; border: 2px solid #e1efe1; border-radius: 50%; display: flex; align-items: center; justify-content: center; animation: pulseRing 2s infinite ease-in-out;">
                  <span style="font-size: 32px; line-height: 72px; display: inline-block; animation: floatIcon 3s infinite ease-in-out;">✉️</span>
                </div>

                <h2 style="color: #1a202c; font-size: 22px; font-weight: 700; margin: 0 0 14px 0; font-family: 'Segoe UI', Arial, sans-serif;">
                  Verify your email address
                </h2>
                
                <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 0 auto 32px auto; max-width: 480px;">
                  Thank you for signing up with Medi Store. Please click the button below to confirm your email and gain full secure access to your pharmacy portal.
                </p>

                <!-- Featured Action Button Section -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center">
                      <a href="${verificationUrl}" class="verify-btn" style="display: inline-block; padding: 15px 40px; background-color: #3C693B; color: #ffffff !important; text-decoration: none; font-weight: 700; border-radius: 12px; font-size: 16px; box-shadow: 0 6px 18px rgba(59, 116, 58, 0.25); transition: all 0.2s ease; border: 1px solid rgba(0,0,0,0.05);">
                        Confirm My Email Address
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Security Link Expiration Warning -->
                <p style="color: #718096; font-size: 12px; margin: 28px 0 0 0;">
                  ⚠️ This verification link will expire in <span style="font-weight: 600; color: #4a5568;">24 hours</span> for your security.
                </p>

              </td>
            </tr>

            <!-- Human Support Footer Info Block -->
            <tr>
              <td style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #edf2f7;">
                <p style="margin: 0 0 10px 0; font-size: 13px; color: #4a5568; font-weight: 500;">
                  Need immediate help setting up? 📞 
                  <a href="tel:18005550199" style="color: #3C693B; text-decoration: none; font-weight: 700;">1-800-555-0199</a>
                </p>
                <p style="margin: 0; font-size: 12px; color: #a0aec0; line-height: 1.5; max-width: 460px; margin: 0 auto;">
                  If you didn’t register an account on the Medi Store portal, you can safely skip and ignore this email notification.
                </p>
              </td>
            </tr>

          </table>

          <!-- Secondary Bottom Brand Disclaimer -->
          <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-content" style="margin-top: 20px; text-align: center;">
            <tr>
              <td style="font-size: 11px; color: #a0aec0; padding: 0 20px; line-height: 1.4;">
                This is an automated security message. Please do not reply directly to this mail box. <br>
                © 2026 Medi Store Inc. All Rights Reserved.
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>

  </body>
</html>
`,
        });

        // console.log("Message sent: %s", info.messageId);
      } catch (err) {
        console.error("Error while sending mail", err);
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET_ID as string,
      prompt: "select_account consent",
    },
  },

  baseURL: process.env.APP_URL || "http://localhost:3000", // Backend-er full auth path
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.APP_URL || "http://localhost:3000"],

  advanced: {
    cookies: {
      session_token: {
        name: "session_token", // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
      state: {
        name: "session_token", // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
    },
  },

  // cookie: {
  //   secure: false,
  // },

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

  plugins: [oAuthProxy()],
});
