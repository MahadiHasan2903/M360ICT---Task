import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Middleware to verify JWT token and role
export function authenticateTokenAndRole(roles: string | string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    // Get the JWT token from headers
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized: User not logged in",
        data: {},
      });
    }

    // Verify JWT token
    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
      (err: any, decoded: any) => {
        if (err) {
          return res.status(403).json({
            status: false,
            message: "Unauthorized: User not logged in",
            data: {},
          });
        }

        // Check if the decoded token has one of the required roles
        if (decoded && isAllowedRole(decoded.role, roles)) {
          req.body.decodedToken = decoded as JwtPayload;
          next();
        } else {
          return res.status(403).json({
            status: false,
            message: "Forbidden resources: Insufficient role permissions",
            data: {},
          });
        }
      }
    ) as any;
  };
}

// Helper function to check if the decoded token's role matches any of the allowed roles
function isAllowedRole(
  decodedRole: string,
  allowedRoles: string | string[]
): boolean {
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(decodedRole);
  } else {
    return decodedRole === allowedRoles;
  }
}
