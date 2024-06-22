import type { TokenPayload } from "./security";

export interface AuthPolicy {
  (jwt: TokenPayload): boolean;
}

export function requireAdmin(jwt: TokenPayload): boolean {
  return jwt.role == "admin";
}
