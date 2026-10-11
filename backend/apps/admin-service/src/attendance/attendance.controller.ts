import { Auth, Role } from '@app/common';
import { Controller, Get, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service.js';
import { ListAttendancesQueryDto } from './list-attendances.dto.js';

@Controller('attendances')
@Auth(Role.ADMIN)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  findAll(@Query() query: ListAttendancesQueryDto) {
    return this.attendanceService.findAll(query);
  }
}
