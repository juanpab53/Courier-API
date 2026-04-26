import { Injectable } from '@nestjs/common';
import { ShipmentStrategyPort, ShipmentStrategyResult } from '../../domain/ports/shipment-strategy.port';
import { ShipmentModel } from '../../domain/models/shipment.model';
import { InvalidShipmentException } from '../../domain/exceptions/shipment.exceptions';

@Injectable()
export class ThirdPartyCarrierStrategy extends ShipmentStrategyPort {
  validate(metadata: Record<string, any>, declaredValue: number): void {
    if (declaredValue <= 0) {
      throw new InvalidShipmentException('declaredValue must be greater than 0');
    }
    if (!metadata.carrierName) {
      throw new InvalidShipmentException('ThirdParty: carrierName is required');
    }
    if (!metadata.externalTrackingId) {
      throw new InvalidShipmentException('ThirdParty: externalTrackingId is required');
    }
  }

  calculateCost(_metadata: Record<string, any>, declaredValue: number): number {
    return declaredValue * 0.05;
  }

  execute(model: ShipmentModel): ShipmentStrategyResult {
    model.markDelivered();
    return {
      cost: model.shippingCost,
      finalStatus: 'DELIVERED',
    };
  }
}