import { PROFILE_UPDATED } from '@app/common';
import { BadRequestException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { of, throwError } from 'rxjs';
import { ProfileService } from './profile.service.js';

const user = { id: 7, name: 'Budi', email: 'budi@company.com', phone: '0811111111', avatar: null };
const config = { get: (_key: string, fallback: unknown) => fallback } as any;

const setup = (emitResult = of(undefined)) => {
  const users = {
    findOneBy: vi.fn(async () => ({ ...user })),
    update: vi.fn(async () => undefined),
  };
  const client = { emit: vi.fn(() => emitResult) };
  return { users, client, service: new ProfileService(users as any, client as any, config) };
};

describe('ProfileService', () => {
  it('hashes the new password, saves phone and publishes which fields changed', async () => {
    const { users, client, service } = setup();

    await service.update(7, { phone: '0822222222', password: 'newpass1' });

    const [, patch] = users.update.mock.calls[0] as any[];
    expect(patch.phone).toBe('0822222222');
    expect(await bcrypt.compare('newpass1', patch.password)).toBe(true);
    expect(client.emit).toHaveBeenCalledWith(
      PROFILE_UPDATED,
      expect.objectContaining({ userId: 7, email: user.email, changedFields: ['phone', 'password'] }),
    );
  });

  it('never puts the password in the event', async () => {
    const { client, service } = setup();
    await service.update(7, { password: 'newpass1' });
    expect(JSON.stringify((client.emit.mock.calls[0] as any[])[1])).not.toContain('newpass1');
  });

  it('rejects an update that changes nothing', async () => {
    const { client, service } = setup();
    await expect(service.update(7, { phone: user.phone })).rejects.toBeInstanceOf(BadRequestException);
    expect(client.emit).not.toHaveBeenCalled();
  });

  it('still succeeds when RabbitMQ is unavailable', async () => {
    const { service } = setup(throwError(() => new Error('ECONNREFUSED')));
    await expect(service.update(7, { phone: '0833333333' })).resolves.toBeDefined();
  });
});
