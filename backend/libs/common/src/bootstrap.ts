import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { UPLOADS_PREFIX, uploadDir } from './uploads/avatar-upload.js';

interface HttpOptions {
  /** Env var holding the port, e.g. EMPLOYEE_SERVICE_PORT. */
  portEnv: string;
  defaultPort: number;
  /** Serve uploaded avatars under /uploads. */
  serveUploads?: boolean;
}

/** HTTP setup shared by every service: /api prefix, CORS, validation, static uploads. */
export const configureHttp = (
  app: NestExpressApplication,
  { serveUploads = false }: Pick<HttpOptions, 'serveUploads'> = {},
) => {
  const config = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: config
      .get('CORS_ORIGINS', 'http://localhost:3000,http://localhost:3001')
      .split(',')
      .map((origin: string) => origin.trim()),
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  if (serveUploads) {
    app.useStaticAssets(uploadDir(config), { prefix: UPLOADS_PREFIX });
  }
};

export const listen = async (
  app: NestExpressApplication,
  name: string,
  { portEnv, defaultPort }: Omit<HttpOptions, 'serveUploads'>,
) => {
  const port = Number(app.get(ConfigService).get(portEnv, defaultPort));
  await app.listen(port);
  new Logger(name).log(`Listening on http://localhost:${port}/api`);
};
