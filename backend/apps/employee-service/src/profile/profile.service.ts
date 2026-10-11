import {
  LOGGING_CLIENT,
  PROFILE_UPDATED,
  ProfileField,
  ProfileUpdatedEvent,
  removeAvatar,
  UPLOADS_PREFIX,
  User,
} from '@app/common';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './update-profile.dto.js';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @Inject(LOGGING_CLIENT) private readonly loggingClient: ClientProxy,
    private readonly config: ConfigService,
  ) {}

  async findOne(id: number) {
    const user = await this.users.findOneBy({ id });
    if (!user) throw new NotFoundException('Employee not found');
    return user;
  }

  async update(id: number, dto: UpdateProfileDto) {
    const user = await this.findOne(id);
    const patch: Partial<User> = {};
    const changed: ProfileField[] = [];

    if (dto.phone !== undefined && dto.phone !== user.phone) {
      patch.phone = dto.phone;
      changed.push('phone');
    }
    if (dto.password) {
      patch.password = await bcrypt.hash(dto.password, 10);
      changed.push('password');
    }
    if (!changed.length) throw new BadRequestException('Nothing to update');

    await this.users.update(id, patch);
    this.publishUpdate(user, changed);
    return this.findOne(id);
  }

  async updateAvatar(id: number, file: Express.Multer.File | undefined) {
    if (!file) throw new BadRequestException('avatar file is required');
    const user = await this.findOne(id);
    await this.users.update(id, { avatar: `${UPLOADS_PREFIX}${file.filename}` });
    await removeAvatar(this.config, user.avatar);
    this.publishUpdate(user, ['avatar']);
    return this.findOne(id);
  }

  /**
   * Fire-and-forget: the profile change is already saved, so a RabbitMQ outage
   * must not fail the request; it is only logged.
   */
  private publishUpdate(user: User, changedFields: ProfileField[]) {
    const event: ProfileUpdatedEvent = {
      userId: user.id,
      name: user.name,
      email: user.email,
      changedFields,
      occurredAt: new Date().toISOString(),
    };
    this.loggingClient.emit(PROFILE_UPDATED, event).subscribe({
      error: (err: Error) =>
        this.logger.warn(`Could not publish ${PROFILE_UPDATED}: ${err.message}`),
    });
  }
}
