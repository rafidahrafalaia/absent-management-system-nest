import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Role } from '../entities/user.entity.js';
import { AuthGuard, ROLES_KEY } from './auth.guard.js';
import type { JwtPayload } from './jwt-payload.interface.js';

/** Requires a valid JWT whose role is one of `roles`. */
export const Auth = (...roles: Role[]) =>
  applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(AuthGuard));

/** The JWT payload of the authenticated user. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtPayload =>
    context.switchToHttp().getRequest().user,
);
