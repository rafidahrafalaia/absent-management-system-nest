import { configureHttp, listen } from '@app/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AdminServiceModule } from './admin-service.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AdminServiceModule);
  configureHttp(app, { serveUploads: true });
  await listen(app, 'AdminService', { portEnv: 'ADMIN_SERVICE_PORT', defaultPort: 3003 });
}
await bootstrap();
