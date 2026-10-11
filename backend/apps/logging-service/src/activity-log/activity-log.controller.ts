import { Auth, PROFILE_UPDATED, type ProfileUpdatedEvent, Role } from '@app/common';
import { Controller, Get, Logger, Query } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service.js';
import { ActivityLog } from './activity-log.entity.js';

class ListActivityLogsQueryDto {
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
  limit = 20;
}

@Controller('activity-logs')
export class ActivityLogController {
  private readonly logger = new Logger(ActivityLogController.name);

  constructor(
    @InjectRepository(ActivityLog) private readonly logs: Repository<ActivityLog>,
    private readonly notificationsService: NotificationsService,
  ) {}

  /** Consumes profile-change events from RabbitMQ. */
  @EventPattern(PROFILE_UPDATED)
  async onProfileUpdated(@Payload() event: ProfileUpdatedEvent) {
    await this.logs.save({
      userId: event.userId,
      email: event.email,
      event: PROFILE_UPDATED,
      changedFields: event.changedFields,
      payload: event,
      occurredAt: new Date(event.occurredAt),
    });

    await this.notificationsService
      .notify({
        title: 'Employee profile updated',
        body: `${event.name} (${event.email}) changed their ${event.changedFields.join(', ')}`,
        occurredAt: event.occurredAt,
      })
      .catch((err: Error) => this.logger.warn(`Notification failed: ${err.message}`));
  }

  @Get()
  @Auth(Role.ADMIN)
  async findAll(@Query() { page, limit }: ListActivityLogsQueryDto) {
    const [data, total] = await this.logs.findAndCount({
      order: { occurredAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, page, limit, total };
  }
}
