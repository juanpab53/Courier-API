import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka, Client, Transport, EventPattern, Payload } from '@nestjs/microservices';
import { ShipmentEvent } from '../../../events/event-publisher.port';

@Injectable()
export class AuditConsumer implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        clientId: 'courier-api-audit',
      },
      consumer: {
        groupId: 'audit-consumer-group',
      },
    },
  })
  private client: ClientKafka;

  private readonly logger = new Logger(AuditConsumer.name);

  async onModuleInit() {
    await this.client.connect();
    this.logger.log('Audit consumer connected to Kafka');
  }

  @EventPattern('shipment.dispatched')
  async handleDispatched(@Payload() message: any) {
    const event: ShipmentEvent = JSON.parse(message.value || message);
    const offset = message.offset || 'N/A';
    this.logger.log(
      `[AUDIT] Topic: shipment.dispatched | Offset: ${offset} | ` +
      `ShipmentId: ${event.shipmentId} | Timestamp: ${event.timestamp} | ` +
      `Type: ${event.type} | Status: ${event.status}`
    );
  }

  @EventPattern('shipment.in_customs')
  async handleInCustoms(@Payload() message: any) {
    const event: ShipmentEvent = JSON.parse(message.value || message);
    const offset = message.offset || 'N/A';
    this.logger.log(
      `[AUDIT] Topic: shipment.in_customs | Offset: ${offset} | ` +
      `ShipmentId: ${event.shipmentId} | Timestamp: ${event.timestamp} | ` +
      `Type: ${event.type} | Status: ${event.status}`
    );
  }

  @EventPattern('shipment.failed')
  async handleFailed(@Payload() message: any) {
    const event: ShipmentEvent = JSON.parse(message.value || message);
    const offset = message.offset || 'N/A';
    this.logger.log(
      `[AUDIT] Topic: shipment.failed | Offset: ${offset} | ` +
      `ShipmentId: ${event.shipmentId} | Timestamp: ${event.timestamp} | ` +
      `Type: ${event.type} | Status: ${event.status}`
    );
  }
}
