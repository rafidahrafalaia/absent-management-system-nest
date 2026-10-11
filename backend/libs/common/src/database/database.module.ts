import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '../entities/attendance.entity.js';
import { User } from '../entities/user.entity.js';
import { UTC_MYSQL_OPTIONS } from './utc-mysql-driver.js';

/** Connection to the main HR database shared by the employee and admin services. */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        ...UTC_MYSQL_OPTIONS,
        host: config.get('DB_HOST', 'localhost'),
        port: Number(config.get('DB_PORT', 3306)),
        username: config.get('DB_USERNAME', 'root'),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('DB_NAME', 'absensi'),
        entities: [User, Attendance],
        synchronize: config.get('DB_SYNCHRONIZE', 'true') === 'true',
      }),
    }),
  ],
})
export class DatabaseModule {}
