import { Module } from '@nestjs/common';
import { KafkaEventPublisher } from './events/kafka-event-publisher';
import { NotificationsConsumer } from './infrastructure/kafka/consumers/notifications.consumer';
import { AuditConsumer } from './infrastructure/kafka/consumers/audit.consumer';

@Module({
  providers: [
    KafkaEventPublisher,
    NotificationsConsumer,
    AuditConsumer,
  ],
  exports: [KafkaEventPublisher],
})
export class SharedModule {}
