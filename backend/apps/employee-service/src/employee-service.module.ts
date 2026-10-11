import {
  Attendance,
  AuthModule,
  avatarMulterOptions,
  DatabaseModule,
  JwtConfigModule,
  LOGGING_CLIENT,
  rmqOptions,
  User,
} from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance/attendance.controller.js';
import { AttendanceService } from './attendance/attendance.service.js';
import { AuthController } from './auth/auth.controller.js';
import { ProfileController } from './profile/profile.controller.js';
import { ProfileService } from './profile/profile.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    JwtConfigModule,
    AuthModule,
    TypeOrmModule.forFeature([User, Attendance]),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: avatarMulterOptions,
    }),
    ClientsModule.registerAsync([
      { name: LOGGING_CLIENT, inject: [ConfigService], useFactory: rmqOptions },
    ]),
  ],
  controllers: [AuthController, ProfileController, AttendanceController],
  providers: [ProfileService, AttendanceService],
})
export class EmployeeServiceModule {}
