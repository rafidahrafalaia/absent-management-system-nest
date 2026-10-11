import type { Role } from '../entities/user.entity.js';

export interface JwtPayload {
  sub: number;
  email: string;
  name: string;
  role: Role;
}
