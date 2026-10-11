import { configureHttp, listen, rmqOptions } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { LoggingServiceModule } from './logging-service.module.js';

/** Hybrid app: RabbitMQ consumer plus a small HTTP API for the admin app. */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(LoggingServiceModule);
  app.connectMicroservice(rmqOptions(app.get(ConfigService)));
  configureHttp(app);
  await app.startAllMicroservices();
  await listen(app, 'LoggingService', { portEnv: 'LOGGING_SERVICE_PORT', defaultPort: 4000 });
}
await bootstrap();
