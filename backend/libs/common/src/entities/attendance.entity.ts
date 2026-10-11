import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity.js';

export enum AttendanceStatus {
  CLOCK_IN = 'IN',
  CLOCK_OUT = 'OUT',
}

/**
 * One row per clock event. An employee has at most one IN and one OUT per day.
 */
@Entity({ name: 'attendances' })
@Index('uq_attendance_user_date_status', ['userId', 'date', 'status'], {
  unique: true,
})
export class Attendance {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ name: 'user_id', unsigned: true })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  /** YYYY-MM-DD in the application timezone. */
  @Column({ type: 'date' })
  date: string;

  /** HH:mm:ss in the application timezone. */
  @Column({ type: 'time' })
  time: string;

  @Column({ type: 'enum', enum: AttendanceStatus })
  status: AttendanceStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
