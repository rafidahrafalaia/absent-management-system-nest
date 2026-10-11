import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { cert, initializeApp } from 'firebase-admin/app';
import { getMessaging, type Messaging } from 'firebase-admin/messaging';
import { readFileSync } from 'node:fs';
import { Subject } from 'rxjs';
import { In, Repository } from 'typeorm';
import { Device } from '../devices/device.entity.js';

export interface AdminNotification {
  title: string;
  body: string;
  occurredAt: string;
}

/**
 * Delivers popups to the HR admin app:
 * - always over Server-Sent Events to every open admin tab;
 * - additionally as a Firebase Cloud Messaging push when a service account is configured.
 */
@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly stream = new Subject<AdminNotification>();
  private messaging?: Messaging;

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(Device) private readonly devices: Repository<Device>,
  ) {}

  onModuleInit() {
    const path = this.config.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');
    if (!path) {
      this.logger.log('FIREBASE_SERVICE_ACCOUNT_PATH not set; FCM push disabled, SSE only');
      return;
    }
    const app = initializeApp({ credential: cert(JSON.parse(readFileSync(path, 'utf8'))) });
    this.messaging = getMessaging(app);
  }

  get notifications$() {
    return this.stream.asObservable();
  }

  async notify(notification: AdminNotification) {
    this.stream.next(notification);
    if (!this.messaging) return;

    const devices = await this.devices.find();
    if (!devices.length) return;
    const tokens = devices.map((d) => d.fcmToken);
    const result = await this.messaging.sendEachForMulticast({
      tokens,
      notification: { title: notification.title, body: notification.body },
    });

    // Forget tokens FCM says are no longer valid.
    const stale = tokens.filter(
      (_token, i) =>
        result.responses[i].error?.code === 'messaging/registration-token-not-registered',
    );
    if (stale.length) await this.devices.delete({ fcmToken: In(stale) });
  }
}
