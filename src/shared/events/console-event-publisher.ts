import { Injectable, Logger } from '@nestjs/common';
import { EventPublisherPort, ShipmentEvent } from './event-publisher.port';

@Injectable()
export class ConsoleEventPublisher extends EventPublisherPort {
  private readonly logger = new Logger(ConsoleEventPublisher.name);

  async publish(topic: string, event: ShipmentEvent): Promise<void> {
    this.logger.log(`[${topic}] Event published: ${JSON.stringify(event)}`);
  }
}