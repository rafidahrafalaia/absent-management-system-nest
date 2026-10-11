import {
  Auth,
  CurrentUser,
  DateRangeQueryDto,
  type JwtPayload,
  Role,
} from '@app/common';
import { Controller, Get, Post, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service.js';

@Controller('attendances')
@Auth(Role.EMPLOYEE)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  clockIn(@CurrentUser() user: JwtPayload) {
    return this.attendanceService.clockIn(user.sub);
  }

  @Post('clock-out')
  clockOut(@CurrentUser() user: JwtPayload) {
    return this.attendanceService.clockOut(user.sub);
  }

  @Get()
  summary(@CurrentUser() user: JwtPayload, @Query() { from, to }: DateRangeQueryDto) {
    return this.attendanceService.summary(user.sub, from, to);
  }
}
