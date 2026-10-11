/** Injection token of the RabbitMQ client that publishes to the logging service. */
export const LOGGING_CLIENT = 'LOGGING_CLIENT';

/** RabbitMQ event pattern emitted whenever an employee changes their profile. */
export const PROFILE_UPDATED = 'employee.profile_updated';

export type ProfileField = 'avatar' | 'phone' | 'password';

export interface ProfileUpdatedEvent {
  userId: number;
  name: string;
  email: string;
  changedFields: ProfileField[];
  /** ISO timestamp. */
  occurredAt: string;
}
