import { Auth, CurrentUser, type JwtPayload, Role } from '@app/common';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service.js';
import { UpdateProfileDto } from './update-profile.dto.js';

@Controller('profile')
@Auth(Role.EMPLOYEE)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  get(@CurrentUser() user: JwtPayload) {
    return this.profileService.findOne(user.sub);
  }

  @Patch()
  update(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
    return this.profileService.update(user.sub, dto);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    return this.profileService.updateAvatar(user.sub, file);
  }
}
