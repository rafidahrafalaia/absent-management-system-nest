import { JwtConfigModule, UTC_MYSQL_OPTIONS } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogController } from './activity-log/activity-log.controller.js';
import { ActivityLog } from './activity-log/activity-log.entity.js';
import { Device } from './devices/device.entity.js';
import { DevicesController } from './devices/devices.controller.js';
import { NotificationsController } from './notifications/notifications.controller.js';
import { NotificationsService } from './notifications/notifications.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtConfigModule,
    // Logging has its own database, separate from the HR database.
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        ...UTC_MYSQL_OPTIONS,
        host: config.get('DB_HOST', 'localhost'),
        port: Number(config.get('DB_PORT', 3306)),
        username: config.get('DB_USERNAME', 'root'),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('LOGGING_DB_NAME', 'absensi_logging'),
        entities: [ActivityLog, Device],
        synchronize: config.get('DB_SYNCHRONIZE', 'true') === 'true',
      }),
    }),
    TypeOrmModule.forFeature([ActivityLog, Device]),
  ],
  controllers: [ActivityLogController, DevicesController, NotificationsController],
  providers: [NotificationsService],
})
export class LoggingServiceModule {}
