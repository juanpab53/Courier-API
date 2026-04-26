import { Injectable } from '@nestjs/common';
import { ShipmentStrategyPort, ShipmentStrategyResult } from '../../domain/ports/shipment-strategy.port';
import { ShipmentModel } from '../../domain/models/shipment.model';
import { InvalidShipmentException } from '../../domain/exceptions/shipment.exceptions';

@Injectable()
export class ExpressShippingStrategy extends ShipmentStrategyPort {
  validate(metadata: Record<string, any>, declaredValue: number): void {
    if (declaredValue <= 0) {
      throw new InvalidShipmentException('declaredValue must be greater than 0');
    }
    if (!metadata.weightKg || metadata.weightKg > 5) {
      throw new InvalidShipmentException('Express: weightKg must be <= 5');
    }
    if (declaredValue > 3000000) {
      throw new InvalidShipmentException('Express: declaredValue must be <= 3,000,000');
    }
  }

  calculateCost(_metadata: Record<string, any>, _declaredValue: number): number {
    return 15000;
  }

  execute(model: ShipmentModel): ShipmentStrategyResult {
    model.markDelivered();
    return {
      cost: model.shippingCost,
      finalStatus: 'DELIVERED',
    };
  }
}