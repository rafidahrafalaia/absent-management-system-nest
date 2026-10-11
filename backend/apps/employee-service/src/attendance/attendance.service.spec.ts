import { AttendanceStatus } from '@app/common';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { AttendanceService } from './attendance.service.js';

const config = { get: (_key: string, fallback: unknown) => fallback } as any;

const makeService = (repo: Record<string, any>) => new AttendanceService(repo as any, config);

describe('AttendanceService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // 2026-10-10 08:05:09 in Asia/Jakarta (UTC+7)
    vi.setSystemTime(new Date('2026-10-10T01:05:09Z'));
  });
  afterEach(() => vi.useRealTimers());

  it('clocks in with the local date and zero-padded time', async () => {
    const save = vi.fn(async (row) => row);
    const service = makeService({ findOneBy: vi.fn(async () => null), save });

    await service.clockIn(7);

    expect(save).toHaveBeenCalledWith({
      userId: 7,
      date: '2026-10-10',
      time: '08:05:09',
      status: AttendanceStatus.CLOCK_IN,
    });
  });

  it('rejects a second clock-in on the same day', async () => {
    const service = makeService({ findOneBy: vi.fn(async () => ({ time: '08:00:00' })) });
    await expect(service.clockIn(7)).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects clock-out before clock-in', async () => {
    const service = makeService({ existsBy: vi.fn(async () => false) });
    await expect(service.clockOut(7)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('moves an existing clock-out to the current time', async () => {
    const save = vi.fn(async (row) => row);
    const service = makeService({
      existsBy: vi.fn(async () => true),
      findOneBy: vi.fn(async () => ({ id: 3, time: '17:00:00' })),
      save,
    });

    await service.clockOut(7);

    expect(save).toHaveBeenCalledWith(expect.objectContaining({ id: 3, time: '08:05:09' }));
  });

  it('defaults the summary to the first of the month through today and pairs IN/OUT per day', async () => {
    const find = vi.fn(async () => [
      { date: '2026-10-10', time: '08:00:00', status: AttendanceStatus.CLOCK_IN },
      { date: '2026-10-09', time: '17:01:00', status: AttendanceStatus.CLOCK_OUT },
      { date: '2026-10-09', time: '08:02:00', status: AttendanceStatus.CLOCK_IN },
    ]);
    const service = makeService({ find });

    const result = await service.summary(7);

    expect(result.from).toBe('2026-10-01');
    expect(result.to).toBe('2026-10-10');
    expect(result.today).toEqual({ date: '2026-10-10', clockIn: '08:00:00', clockOut: null });
    expect(result.data).toEqual([
      { date: '2026-10-10', clockIn: '08:00:00', clockOut: null },
      { date: '2026-10-09', clockIn: '08:02:00', clockOut: '17:01:00' },
    ]);
  });

  it('rejects a range where from is after to', async () => {
    const service = makeService({});
    await expect(service.summary(7, '2026-10-10', '2026-10-01')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
