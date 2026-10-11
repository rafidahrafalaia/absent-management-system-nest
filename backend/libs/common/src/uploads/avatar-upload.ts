import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { MulterModuleOptions } from '@nestjs/platform-express';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { diskStorage } from 'multer';

/** Public URL prefix under which avatars are served. */
export const UPLOADS_PREFIX = '/uploads/';

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

/** Absolute directory for uploaded avatars; the employee and admin services share it. */
export const uploadDir = (config: ConfigService) => {
  const dir = resolve(config.get('UPLOAD_DIR', 'uploads'));
  mkdirSync(dir, { recursive: true });
  return dir;
};

export const avatarMulterOptions = (
  config: ConfigService,
): MulterModuleOptions => ({
  storage: diskStorage({
    destination: uploadDir(config),
    filename: (_req, file, cb) =>
      cb(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: MAX_AVATAR_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
      return cb(
        new BadRequestException('Avatar must be a JPG, PNG, WEBP or GIF image'),
        false,
      );
    }
    cb(null, true);
  },
});

/** Deletes a previously uploaded avatar; ignores external URLs and missing files. */
export const removeAvatar = async (
  config: ConfigService,
  avatar: string | null,
) => {
  if (!avatar?.startsWith(UPLOADS_PREFIX)) return;
  const file = avatar.slice(UPLOADS_PREFIX.length);
  if (file.includes('/') || file.includes('..')) return;
  await unlink(join(uploadDir(config), file)).catch(() => undefined);
};
