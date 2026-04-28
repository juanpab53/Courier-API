import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka, Client, Transport, EventPattern, Payload } from '@nestjs/microservices';
import { ShipmentEvent } from '../../../events/event-publisher.port';

@Injectable()
export class NotificationsConsumer implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        clientId: 'courier-api-notifications',
      },
      consumer: {
        groupId: 'notifications-consumer-group',
      },
    },
  })
  private client: ClientKafka;

  private readonly logger = new Logger(NotificationsConsumer.name);

  async onModuleInit() {
    await this.client.connect();
    this.logger.log('Notifications consumer connected to Kafka');
  }

  @EventPattern('shipment.dispatched')
  async handleDispatched(@Payload() message: any) {
    const event: ShipmentEvent = JSON.parse(message.value || message);
    this.logger.log(
      `[NOTIFICATION] Shipment ${event.shipmentId} has been DISPATCHED. ` +
      `Sender: ${event.senderId}, Recipient: ${event.recipientId}, ` +
      `Cost: $${event.shippingCost}, Type: ${event.type}`
    );
  }

  @EventPattern('shipment.in_customs')
  async handleInCustoms(@Payload() message: any) {
    const event: ShipmentEvent = JSON.parse(message.value || message);
    this.logger.log(
      `[NOTIFICATION] Shipment ${event.shipmentId} is IN CUSTOMS. ` +
      `Sender: ${event.senderId}, Recipient: ${event.recipientId}, ` +
      `Declared Value: $${event.declaredValue}, Type: ${event.type}`
    );
  }

  @EventPattern('shipment.failed')
  async handleFailed(@Payload() message: any) {
    const event: ShipmentEvent = JSON.parse(message.value || message);
    this.logger.log(
      `[NOTIFICATION] Shipment ${event.shipmentId} has FAILED. ` +
      `Sender: ${event.senderId}, Recipient: ${event.recipientId}, ` +
      `Type: ${event.type}, Status: ${event.status}`
    );
  }
}
