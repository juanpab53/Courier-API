import { Injectable } from '@nestjs/common';
import { ShipmentModel } from '../../domain/models/shipment.model';
import { ShipmentRepositoryPort } from '../../domain/ports/shipment-repository';
import { ShipmentNotFoundException } from '../../domain/exceptions/shipment.exceptions';

@Injectable()
export class GetShipmentByIdUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepositoryPort) {}

  async execute(id: string): Promise<ShipmentModel> {
    const shipment = await this.shipmentRepository.findById(id);
    if (!shipment) {
      throw new ShipmentNotFoundException(id);
    }
    return shipment;
  }
}