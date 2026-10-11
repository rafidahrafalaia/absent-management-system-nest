import { IntersectionType } from '@nestjs/mapped-types';
import { DateRangeQueryDto } from '@app/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { PaginationQueryDto } from '../employees/employee.dto.js';

export class ListAttendancesQueryDto extends IntersectionType(
  PaginationQueryDto,
  DateRangeQueryDto,
) {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  employeeId?: number;
}
