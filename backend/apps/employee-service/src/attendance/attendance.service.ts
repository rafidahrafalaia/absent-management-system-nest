import {
  Attendance,
  AttendanceStatus,
  nowIn,
  startOfMonth,
} from '@app/common';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

export interface DailyAttendance {
  date: string;
  clockIn: string | null;
  clockOut: string | null;
}

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendances: Repository<Attendance>,
    private readonly config: ConfigService,
  ) {}

  private now() {
    return nowIn(this.config.get('APP_TIMEZONE', 'Asia/Jakarta'));
  }

  async clockIn(userId: number) {
    const { date, time } = this.now();
    const existing = await this.attendances.findOneBy({
      userId,
      date,
      status: AttendanceStatus.CLOCK_IN,
    });
    if (existing) {
      throw new ConflictException(`You already clocked in today at ${existing.time}`);
    }
    return this.attendances.save({ userId, date, time, status: AttendanceStatus.CLOCK_IN });
  }

  /** Clocking out again on the same day moves the clock-out time to now. */
  async clockOut(userId: number) {
    const { date, time } = this.now();
    const clockedIn = await this.attendances.existsBy({
      userId,
      date,
      status: AttendanceStatus.CLOCK_IN,
    });
    if (!clockedIn) throw new BadRequestException('Please clock in first');

    const existing = await this.attendances.findOneBy({
      userId,
      date,
      status: AttendanceStatus.CLOCK_OUT,
    });
    return this.attendances.save({
      id: existing?.id,
      userId,
      date,
      time,
      status: AttendanceStatus.CLOCK_OUT,
    });
  }

  /** Per-day summary; defaults to the first of this month through today. */
  async summary(userId: number, from?: string, to?: string) {
    const today = this.now().date;
    to ??= today;
    from ??= startOfMonth(to);
    if (from > to) throw new BadRequestException('from must be on or before to');

    const rows = await this.attendances.find({
      where: { userId, date: Between(from, to) },
      order: { date: 'DESC' },
    });

    const days = new Map<string, DailyAttendance>();
    for (const row of rows) {
      const day = days.get(row.date) ?? { date: row.date, clockIn: null, clockOut: null };
      if (row.status === AttendanceStatus.CLOCK_IN) day.clockIn = row.time;
      else day.clockOut = row.time;
      days.set(row.date, day);
    }

    const todayRecord = days.get(today) ?? { date: today, clockIn: null, clockOut: null };
    return { from, to, today: todayRecord, data: [...days.values()] };
  }
}
