import { PROFILE_UPDATED, type ProfileUpdatedEvent } from '@app/common';
import { firstValueFrom, take } from 'rxjs';
import { NotificationsService } from '../notifications/notifications.service.js';
import { ActivityLogController } from './activity-log.controller.js';

const event: ProfileUpdatedEvent = {
  userId: 7,
  name: 'Budi',
  email: 'budi@company.com',
  changedFields: ['phone', 'avatar'],
  occurredAt: '2026-10-10T01:05:09.000Z',
};

describe('ActivityLogController.onProfileUpdated', () => {
  it('stores the event in the logging DB and pushes a popup to admins', async () => {
    const logs = { save: vi.fn(async (row) => row) };
    const config = { get: () => undefined } as any; // no Firebase: SSE only
    const notifications = new NotificationsService(config, {} as any);
    notifications.onModuleInit();
    const controller = new ActivityLogController(logs as any, notifications);

    const popup = firstValueFrom(notifications.notifications$.pipe(take(1)));
    await controller.onProfileUpdated(event);

    expect(logs.save).toHaveBeenCalledWith({
      userId: 7,
      email: 'budi@company.com',
      event: PROFILE_UPDATED,
      changedFields: ['phone', 'avatar'],
      payload: event,
      occurredAt: new Date(event.occurredAt),
    });
    expect(await popup).toEqual({
      title: 'Employee profile updated',
      body: 'Budi (budi@company.com) changed their phone, avatar',
      occurredAt: event.occurredAt,
    });
  });
});
