import { IsOptional, Matches } from 'class-validator';

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export class DateRangeQueryDto {
  @IsOptional()
  @Matches(DATE, { message: 'from must be YYYY-MM-DD' })
  from?: string;

  @IsOptional()
  @Matches(DATE, { message: 'to must be YYYY-MM-DD' })
  to?: string;
}
