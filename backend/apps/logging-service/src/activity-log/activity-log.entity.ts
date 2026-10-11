import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/** Audit trail of employee profile changes, stored in the separate logging database. */
@Entity({ name: 'activity_logs' })
export class ActivityLog {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ name: 'user_id', unsigned: true })
  userId: number;

  @Column({ length: 150 })
  email: string;

  @Column({ length: 100 })
  event: string;

  @Column({ name: 'changed_fields', type: 'simple-array' })
  changedFields: string[];

  /** The raw message as received from RabbitMQ. */
  @Column({ type: 'json' })
  payload: object;

  @Column({ name: 'occurred_at', type: 'datetime' })
  occurredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
