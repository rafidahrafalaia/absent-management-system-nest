import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/** Admin browsers registered for Firebase Cloud Messaging push notifications. */
@Entity({ name: 'devices' })
export class Device {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ name: 'fcm_token', length: 512, unique: true })
  fcmToken: string;

  @Column({ name: 'admin_id', unsigned: true })
  adminId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
