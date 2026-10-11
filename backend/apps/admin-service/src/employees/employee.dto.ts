import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  position: string;

  @IsOptional()
  @Matches(/^\+?[0-9]{8,15}$/, { message: 'phone must be 8-15 digits, optionally starting with +' })
  phone?: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;
}

export class ListEmployeesQueryDto extends PaginationQueryDto {
  /** Matches name, email or position. */
  @IsOptional()
  @IsString()
  search?: string;
}
