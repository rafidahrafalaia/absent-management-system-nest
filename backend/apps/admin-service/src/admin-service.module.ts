import {
  Attendance,
  AuthModule,
  avatarMulterOptions,
  DatabaseModule,
  JwtConfigModule,
  User,
} from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSeeder } from './admin.seeder.js';
import { AttendanceController } from './attendance/attendance.controller.js';
import { AttendanceService } from './attendance/attendance.service.js';
import { AuthController } from './auth/auth.controller.js';
import { EmployeesController } from './employees/employees.controller.js';
import { EmployeesService } from './employees/employees.service.js';

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
  ],
  controllers: [AuthController, EmployeesController, AttendanceController],
  providers: [EmployeesService, AttendanceService, AdminSeeder],
})
export class AdminServiceModule {}
