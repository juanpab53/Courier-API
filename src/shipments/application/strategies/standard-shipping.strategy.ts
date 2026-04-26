import { Injectable } from '@nestjs/common';
import { ShipmentStrategyPort, ShipmentStrategyResult } from '../../domain/ports/shipment-strategy.port';
import { ShipmentModel } from '../../domain/models/shipment.model';
import { InvalidShipmentException } from '../../domain/exceptions/shipment.exceptions';

@Injectable()
export class StandardShippingStrategy extends ShipmentStrategyPort {
  validate(metadata: Record<string, any>, declaredValue: number): void {
    if (declaredValue <= 0) {
      throw new InvalidShipmentException('declaredValue must be greater than 0');
    }
    if (!metadata.weightKg || metadata.weightKg > 20) {
      throw new InvalidShipmentException('Standard: weightKg must be <= 20');
    }
  }

  calculateCost(metadata: Record<string, any>, declaredValueIn: number): number {
    const cost = declaredValueIn * 0.001;
    return Math.max(cost, 5000);
  }

  execute(model: ShipmentModel): ShipmentStrategyResult {
    model.markDelivered();
    return {
      cost: model.shippingCost,
      finalStatus: 'DELIVERED',
    };
  }
}