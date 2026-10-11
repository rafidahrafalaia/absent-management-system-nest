import { Auth, CurrentUser, type JwtPayload, Role } from '@app/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { Repository } from 'typeorm';
import { Device } from './device.entity.js';

class RegisterDeviceDto {
  @IsString()
  @MinLength(1)
  @MaxLength(512)
  fcmToken: string;
}

@Controller('devices')
@Auth(Role.ADMIN)
export class DevicesController {
  constructor(@InjectRepository(Device) private readonly devices: Repository<Device>) {}

  @Post()
  @HttpCode(204)
  async register(@CurrentUser() admin: JwtPayload, @Body() { fcmToken }: RegisterDeviceDto) {
    await this.devices.upsert({ fcmToken, adminId: admin.sub }, ['fcmToken']);
  }
}
