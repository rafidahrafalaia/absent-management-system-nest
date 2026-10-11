import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity.js';
import { AuthService } from './auth.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
