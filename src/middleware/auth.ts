import { NextFunction, Request, Response } from "express";
import { auth, auth as betterAuth } from "../lib/auth";
import { UserRole } from "../Types/roleCheck";
import { fromNodeHeaders } from "better-auth/node";

function roleCheckerAuth(...roles: UserRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        res.status(401).send({
          success: false,
          message: "Unauthorized access!",
        });
        return;
      }
      if (!session?.user.emailVerified) {
        res.status(403).send({
          success: false,
          message: "Forbidden access!",
        });
        return;
      }
      req.user = {
        id: session?.user.id as string,
        name: session?.user.name as string,
        email: session?.user.email as string,
        emailVerified: session?.user.emailVerified as boolean,
        role: session?.user.role as string,
      };

      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        // console.log("user role from token...***...", req.user.role);
        res.status(403).send({
          success: false,
          message: "Forbidden access...!",
        });
        return;
      }
      next();
    } catch (error) {
      res.status(500).send({
        error,
      });
    }
  };
}

export default roleCheckerAuth;
