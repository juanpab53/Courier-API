import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka, Client, Transport } from '@nestjs/microservices';
import { EventPublisherPort, ShipmentEvent } from './event-publisher.port';

@Injectable()
export class KafkaEventPublisher extends EventPublisherPort implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        clientId: 'courier-api',
      },
      consumer: {
        groupId: 'courier-api-producer',
      },
    },
  })
  private client: ClientKafka;

  private readonly logger = new Logger(KafkaEventPublisher.name);

  async onModuleInit() {
    await this.client.connect();
    this.logger.log('Kafka producer connected');
  }

  async publish(topic: string, event: ShipmentEvent): Promise<void> {
    try {
      this.logger.log(`Publishing event to topic ${topic}`);
      await this.client.emit(topic, JSON.stringify(event));
      this.logger.log(`Event published successfully to ${topic}`);
    } catch (error) {
      this.logger.error(`Failed to publish event to ${topic}:`, error);
      throw error;
    }
  }
}
