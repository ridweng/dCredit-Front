import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { verifyToken } from "./auth";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Record<string, unknown>>();
    const authHeader = (request["headers"] as Record<string, string>)["authorization"];

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid authorization header");
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      throw new UnauthorizedException("Invalid or expired token");
    }

    (request as Record<string, unknown>)["user"] = payload;
    return true;
  }
}

export function getUserFromRequest(req: Record<string, unknown>): { userId: string; email: string } {
  return req["user"] as { userId: string; email: string };
}
