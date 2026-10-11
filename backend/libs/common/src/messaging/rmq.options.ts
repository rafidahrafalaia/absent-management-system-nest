import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

/** Shared by the publisher (employee service) and the consumer (logging service). */
export const rmqOptions = (config: ConfigService): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: [config.get<string>('RABBITMQ_URL', 'amqp://guest:guest@localhost:5672')],
    queue: config.get('RABBITMQ_QUEUE', 'activity_logs'),
    queueOptions: { durable: true },
  },
});
