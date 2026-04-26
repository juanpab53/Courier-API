import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ShipmentModel, ShipmentType, ShipmentStatus } from '../../domain/models/shipment.model';
import { ShipmentRepositoryPort } from '../../domain/ports/shipment-repository';
import { ShipmentStrategyFactory } from '../strategies/shipment-strategy.factory';
import { CustomerRepositoryPort } from '../../../customers/domain/ports/customer-repository';
import { CreateShipmentDto } from '../../application/dtos/shipment.dto';
import { EventPublisherPort, ShipmentEvent } from '../../../shared/events/event-publisher.port';
import { InvalidShipmentException, SameSenderRecipientException, CustomerNotActiveException } from '../../domain/exceptions/shipment.exceptions';

@Injectable()
export class CreateShipmentUseCase {
  constructor(
    private readonly shipmentRepository: ShipmentRepositoryPort,
    private readonly customerRepository: CustomerRepositoryPort,
    private readonly strategyFactory: ShipmentStrategyFactory,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(dto: CreateShipmentDto): Promise<ShipmentModel> {
    if (dto.senderId === dto.recipientId) {
      throw new SameSenderRecipientException();
    }

    const sender = await this.customerRepository.findById(dto.senderId);
    if (!sender || !sender.isActive) {
      throw new CustomerNotActiveException(dto.senderId);
    }

    const recipient = await this.customerRepository.findById(dto.recipientId);
    if (!recipient || !recipient.isActive) {
      throw new CustomerNotActiveException(dto.recipientId);
    }

    const strategy = this.strategyFactory.getStrategy(dto.type);
    strategy.validate(dto.metadata || {}, dto.declaredValue);

    const shipment = new ShipmentModel(
      uuidv4(),
      dto.senderId,
      dto.recipientId,
      dto.declaredValue,
      0,
      dto.type,
      ShipmentStatus.PENDING,
      dto.metadata || {},
    );

    shipment.shippingCost = strategy.calculateCost(dto.metadata || {}, dto.declaredValue);
    strategy.execute(shipment);

    const saved = await this.shipmentRepository.save(shipment);

    const topic = this.getTopicForStatus(saved.status);
    const event: ShipmentEvent = {
      shipmentId: saved.id,
      senderId: saved.senderId,
      recipientId: saved.recipientId,
      declaredValue: saved.declaredValue,
      shippingCost: saved.shippingCost,
      type: saved.type,
      status: saved.status,
      timestamp: new Date(),
    };
    await this.eventPublisher.publish(topic, event);

    return saved;
  }

  private getTopicForStatus(status: ShipmentStatus): string {
    switch (status) {
      case ShipmentStatus.DELIVERED:
        return 'shipment.dispatched';
      case ShipmentStatus.IN_CUSTOMS:
        return 'shipment.in_customs';
      case ShipmentStatus.FAILED:
        return 'shipment.failed';
      default:
        return 'shipment.unknown';
    }
  }
}