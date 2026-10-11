import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Role, User } from '../entities/user.entity.js';
import { LoginDto } from './login.dto.js';
import type { JwtPayload } from './jwt-payload.interface.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /** Logs a user in, only if they have the role this service is for. */
  async login({ email, password }: LoginDto, role: Role) {
    const user = await this.users
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: email.toLowerCase() })
      .getOne();

    const valid =
      user?.role === role && (await bcrypt.compare(password, user.password));
    if (!user || !valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }
}
