import { configureHttp, listen } from '@app/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { EmployeeServiceModule } from './employee-service.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(EmployeeServiceModule);
  configureHttp(app, { serveUploads: true });
  await listen(app, 'EmployeeService', { portEnv: 'EMPLOYEE_SERVICE_PORT', defaultPort: 3002 });
}
await bootstrap();
