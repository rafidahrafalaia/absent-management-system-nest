import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

/** Employees may only change their phone number and password (and photo via the avatar endpoint). */
export class UpdateProfileDto {
  @IsOptional()
  @Matches(/^\+?[0-9]{8,15}$/, { message: 'phone must be 8-15 digits, optionally starting with +' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
