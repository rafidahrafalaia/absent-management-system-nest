import { Auth, Role } from '@app/common';
import { Controller, type MessageEvent, Sse } from '@nestjs/common';
import { map, type Observable } from 'rxjs';
import { NotificationsService } from './notifications.service.js';

@Controller('notifications')
@Auth(Role.ADMIN)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /** EventSource endpoint; pass the admin JWT as `?token=` since EventSource cannot set headers. */
  @Sse('stream')
  stream(): Observable<MessageEvent> {
    return this.notificationsService.notifications$.pipe(map((data) => ({ data })));
  }
}
