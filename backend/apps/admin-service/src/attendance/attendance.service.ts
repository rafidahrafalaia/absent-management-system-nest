import { Attendance } from '@app/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListAttendancesQueryDto } from './list-attendances.dto.js';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendances: Repository<Attendance>,
  ) {}

  /** Read-only list of every employee's clock events, newest first. */
  async findAll({ page, limit, from, to, employeeId }: ListAttendancesQueryDto) {
    if (from && to && from > to) {
      throw new BadRequestException('from must be on or before to');
    }
    const query = this.attendances
      .createQueryBuilder('attendance')
      .innerJoin('attendance.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.email', 'user.position'])
      .orderBy('attendance.date', 'DESC')
      .addOrderBy('attendance.time', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    if (from) query.andWhere('attendance.date >= :from', { from });
    if (to) query.andWhere('attendance.date <= :to', { to });
    if (employeeId) query.andWhere('attendance.userId = :employeeId', { employeeId });

    const [data, total] = await query.getManyAndCount();
    return { data, page, limit, total };
  }
}
